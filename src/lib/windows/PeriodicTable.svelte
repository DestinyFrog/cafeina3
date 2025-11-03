<script lang="ts">
    import { get_main, handle_error, normalize_category } from "../helpers"
    import type { ElementPayload } from "../models/Element"
    import GasLoading from "../features/GasLoading.svelte"
    import client from "../database/Database"
    import { mount, onMount } from "svelte"
    import Element from "./Element.svelte"
    import Window from "../features/Window.svelte"

    let elements: ElementPayload[] = $state([])
    let is_loading = $state(true)

    let columns = $derived(elements.reduce((prev, { xpos }) => Math.max(prev, xpos), 0))
    let rows = $derived(elements.reduce((prev, { ypos }) => Math.max(prev, ypos), 0))

    function on_click(element: ElementPayload) {
        mount(Element, {
            target: get_main(),
            props: { element },
        })
    }

    onMount(() => {
        client.execute("SELECT * FROM element")
            .then((res) => (elements = res.rows as Object[] as ElementPayload[]))
            .catch(handle_error)
            .finally(() => (is_loading = false))
    })
</script>

<Window title="Tabela Periódica">
    {#snippet content()}
        {#if !is_loading}
            <div
                class="periodic-table"
                style:gridTemplateColumns="repeat({columns}, 1fr);"
                style:gridTemplateRows="repeat({rows}, 1fr);"
            >
                {#each elements as element}
                    <button
                        class="periodic-table-cell category-{normalize_category(element.category)} fase-{element.fase}"
                        style="grid-column: {element.xpos}; grid-row: {element.ypos}"
                        onclick={() => on_click(element)}
                    >
                        {element.symbol}
                    </button>
                {/each}
            </div>
        {:else}
            <GasLoading/>
        {/if}
    {/snippet}
</Window>

<style scoped>
    .periodic-table {
        display: grid;
        padding: 10px;
    }

    .periodic-table-cell {
        width: 30px;
        height: 30px;
        border: 1px solid black;
        aspect-ratio: 1/1;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
    }
</style>
