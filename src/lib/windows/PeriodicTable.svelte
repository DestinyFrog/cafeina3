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
            props: { element },
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

<Window title="Tabela Periódica">
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
    .table-container {
        padding: 10px;
        overflow: auto;
        max-width: 100%;
        display: flex;
        align-items: left;
    }

    .periodic-table {
        display: grid;
        gap: 4px;
        margin: 0 auto;
        max-width: max-content;
    }

    .periodic-table-cell {
        position: relative;
        width: 26px;
        height: 26px;
        border: 0;
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        font-family: 'Segoe UI', system-ui, sans-serif;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .periodic-table-cell:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        border-color: #007acc;
    }

    .periodic-table-cell:active {
        transform: translateY(0);
    }

    .symbol {
        font-size: 1.1em;
        font-weight: 700;
        color: #1a1a1a;
        line-height: 1;
    }

    .atomic-number {
        position: absolute;
        top: 4px;
        left: 4px;
        font-size: 0.7em;
        font-weight: 600;
        color: #666;
    }

    .controls {
        padding: 4px;
        display: flex;
        justify-content: center;
    }

    .toggle {
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
        padding: 8px 16px;
        border-radius: 25px;
        background: wheat;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
    }

    .toggle:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .toggle input[type="checkbox"] {
        display: none;
    }

    .toggle-slider {
        width: 50px;
        height: 24px;
        background: #ccc;
        border-radius: 25px;
        position: relative;
        transition: all 0.3s ease;
    }

    .toggle-slider::before {
        content: '';
        position: absolute;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: white;
        top: 2px;
        left: 2px;
        transition: all 0.3s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    input[type="checkbox"]:checked + .toggle-slider {
        background: #007acc;
    }

    input[type="checkbox"]:checked + .toggle-slider::before {
        transform: translateX(26px);
    }

    .toggle-label {
        font-weight: 600;
        color: #333;
        user-select: none;
    }

    /* Responsividade */
    @media (max-width: 768px) {
        .periodic-table-cell {
            width: 45px;
            height: 45px;
        }

        .symbol {
            font-size: 0.9em;
        }

        .atomic-number {
            font-size: 0.6em;
        }

        .table-container {
            padding: 10px;
        }
    }

    @media (max-width: 480px) {
        .periodic-table-cell {
            width: 35px;
            height: 35px;
        }

        .symbol {
            font-size: 0.8em;
        }

        .atomic-number {
            font-size: 0.5em;
            top: 2px;
            left: 2px;
        }
    }
</style>