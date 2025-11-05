<script lang="ts">
    import Window from "../features/Window.svelte"

    const unit = 28
    const border = 16

    function sublayer_to_num(sublayer: string): number {
        switch (sublayer) {
            case 's': return 1
            case 'p': return 2
            case 'd': return 3
            case 'f': return 4
            default: return 0
        }
    }

    function handle_distribution(data: string) {
        const [ , layer, sublayer, eletrons ] = data.match(/(\d+)([a-z])(\d+)/)!

        return {
            layer: Number(layer),
            sublayer,
            eletrons: Number(eletrons)
        }
    }

    const data = ("1s2 2s2 2p6 3s2 3p6 4s2 3d10 4p6 5s2 4d10 5p6 6s2 4f14 5d10 6p6 7s2 5f14 6d10 7p6")
        .split(' ')
        .map(handle_distribution)
        .map(data => ({
            ... data,
            x: (sublayer_to_num(data.sublayer) - 1)  * unit + border,
            y: (data.layer - 1) * unit + border,
        }))

    let width = data.reduce((prev, cur) => sublayer_to_num(cur.sublayer) > prev ? cur.layer : prev, 0) * unit + border * 2
    let height = data.reduce((prev, cur) => cur.layer > prev ? cur.layer : prev, 0) * unit + border * 2

    let arrows: { ax: number, ay: number, bx: number, by: number }[] = []
    let start_arrow_x = data[0].x + unit
    let start_arrow_y = data[0].y - 8

    for (let i = 0; i < data.length; i++) {
        if (i == data.length - 1 || i == 0) {
            arrows.push({
                ax: start_arrow_x,
                ay: start_arrow_y,
                bx: data[i].x,
                by: data[i].y + unit - 8
            })
            continue
        }

        if (data[i].eletrons > data[i + 1].eletrons &&
            data[i].eletrons > data[i - 1].eletrons ||
            i == 1
        ) {
            start_arrow_x = data[i].x + unit
            start_arrow_y = data[i].y - 8
        }

        if (data[i].eletrons < data[i + 1].eletrons &&
            data[i].eletrons <= data[i - 1].eletrons) {
            arrows.push({
                ax: start_arrow_x,
                ay: start_arrow_y,
                bx: data[i].x,
                by: data[i].y + unit - 8
            })
        }
    }
</script>

<Window title="Diagrama de Linus Pauling">
    {#snippet content()}
        <svg width={width} height={height} xmlns="http://www.w3.org/2000/svg">
            <defs>
                <marker id="arrowhead"
                    markerWidth="10" markerHeight="7" 
                    refX="1" refY="3.5" orient="auto">
                    <polygon points="0 0, 5 3.5, 0 7" fill="black"/>
                </marker>
            </defs>

            {#each data as { x, y, layer, sublayer, eletrons }}
                <text x={x} y={y} class="diagram-cell">
                    { layer }{ sublayer }
                </text>
            {/each}

            {#each arrows as { ax, ay, bx, by }}
                <line x1={ax} y1={ay} x2={bx} y2={by} class="diagram-arrow" />
            {/each}
        </svg>
    {/snippet}
</Window>

<style scoped>
.diagram-cell {
    dominant-baseline: hanging;
    text-anchor: left;
}

.diagram-arrow {
    stroke: black;
    stroke-width: 1;
    marker-end: url(#arrowhead);
}
</style>