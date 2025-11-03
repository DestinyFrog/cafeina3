<script lang="ts">
    import Window from "../features/Window.svelte"

    const unit = 24
    const border = 10

    const max = "1s2 2s2 2p6 3s2 3p6 4s2 3d10 4p6 5s2 4d10 5p6 6s2 4f14 5d10 6p6 7s2 5f14 6d10 7p6"

    const data = []
    const regex = /(\d+)([a-z])(\d+)/

    max.split(' ').forEach(item => {
        const match = item.match(regex);
        if (match) {
            data.push({
                digito1: match[1],
                letra: match[2],
                digito2: match[3]
            });
        }
    })

    console.log()
</script>

{#snippet arrow(ax: number, ay: number, bx: number, by: number)}
    <line x1={ax} y1={ay} x2={bx} y2={by} 
        stroke="black" stroke-width="1.2" 
        marker-end="url(#arrowhead)"/>
{/snippet}

<Window title="Diagrama de Linus Pauling">
    {#snippet content()}
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <marker id="arrowhead"
                markerWidth="10" markerHeight="7" 
                refX="1" refY="3.5" orient="auto">
                <polygon points="0 0, 5 3.5, 0 7" fill="black"/>
            </marker>
        </defs>

        <!-- {@render arrow(10, 10, 40, 20)} -->

        {#each "spdf" as sublevel, i}
            {#each [1, 2, 3, 4, 5, 6, 7] as j}
                <text x={i * unit + border} y={j * unit + border}>
                    { j }{ sublevel }
                </text>
            {/each}
        {/each}
    </svg>
    {/snippet}
</Window>