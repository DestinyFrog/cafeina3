<script lang="ts">
    import Window from "../features/Window.svelte"

    const unit = 24
    const border = 10

    const max = "1s2 2s2 2p6 3s2 3p6 4s2 3d10 4p6 5s2 4d10 5p6 6s2 4f14 5d10 6p6 7s2 5f14 6d10 7p6"

    interface DistributionUnit {
        layer: number,
        sublayer: string,
        eletrons: number
    }

    const data: DistributionUnit[] = []
    const regex = /(\d+)([a-z])(\d+)/

    max.split(' ').forEach(item => {
        const match = item.match(regex);
        if (match) {
            data.push({
                layer: Number(match[1]),
                sublayer: match[2],
                eletrons: Number(match[3])
            });
        }
    })

    function sublayer_to_num(sublayer: string) {
        switch (sublayer) {
            case 's': return 1
            case 'p': return 2
            case 'd': return 3
            case 'f': return 4
        }
    }

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

        {#each data as { layer, sublayer, eletrons }}
            <text x={sublayer_to_num(sublayer)!  * unit + border} y={layer * unit + border}>
                { layer }{ sublayer }
            </text>
        {/each}
    </svg>
    {/snippet}
</Window>