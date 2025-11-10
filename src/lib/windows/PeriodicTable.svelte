<script lang="ts">
    import { get_main, handle_error, normalize_category } from "../helpers"
    import type { ElementPayload } from "../models/Element"
    import GasLoading from "../features/GasLoading.svelte"
    import Window from "../features/Window.svelte"
    import client from "../database/Database"
    import { mount, onMount } from "svelte"
    import Element from "./Element.svelte"

    let extended = $state(false)
    let elements: ElementPayload[] = $state([])
    let is_loading = $state(true)
    let parent: Window

    onMount(() => {
        client
            .execute("SELECT * FROM element")
            .then((res) => (elements = res.rows as Object[] as ElementPayload[]))
            .catch(handle_error)
            .finally(() => (is_loading = false))
    })

    function on_click(element: ElementPayload) {
        mount(Element, {
            target: get_main(),
            props: { element, parent },
        })
    }

    function handle_position(element: ElementPayload): { x: number; y: number } {
        if (extended) {
            return {
                x: element.pos_x_extended,
                y: element.pos_y_extended,
            }
        }

        return {
            x: element.pos_x_normal,
            y: element.pos_y_normal,
        }
    }

    let columns = $state(0)
    let rows = $state(0)
    $effect(() => {
        [columns, rows] = elements.reduce(([max_x, max_y], el) => {
            const { x, y } = handle_position(el)
            return [ Math.max(max_x, x), Math.max(max_y, y) ]
        }, [0, 0])
    })
</script>

{#snippet render_element(element: ElementPayload)}
    {@const { x, y } = handle_position(element)}

    <button
        class="periodic-table-cell category-{normalize_category(element.category)} fase-{element.fase}"
        style="grid-column: {x}; grid-row: {y}"
        onclick={() => on_click(element)}
    >
        {element.symbol}
    </button>
{/snippet}

<Window title="Tabela Periódica" bind:this={parent}>
    {#snippet content()}
        {#if !is_loading}
            <div class="table-container">
                <div
                    class="periodic-table"
                    style:gridTemplateColumns="repeat({columns}, 1fr);"
                    style:gridTemplateRows="repeat({rows}, 1fr);"
                >
                    {#each elements as element}
                        {@render render_element(element)}
                    {/each}
                </div>
            </div>

            <div class="controls">
                <label class="toggle">
                    <input type="checkbox" bind:checked={extended} />
                    <span class="toggle-slider"></span>
                    <span class="toggle-label">Tabela Extendida</span>
                </label>
            </div>
        {:else}
            <GasLoading />
        {/if}
    {/snippet}
</Window>

<style scoped>
.periodic-table {
    display: grid;
    gap: 3px;
}

.periodic-table-cell {
    width: 24px;
    aspect-ratio: 1/1;
}
</style>