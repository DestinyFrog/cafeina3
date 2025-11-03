<script lang="ts">
    import { capitalize, normalize_category } from "../helpers"
    import type { ElementPayload } from "../models/Element"
    import Window from "../features/Window.svelte"

    const {
        element
    }: {
        element: ElementPayload
    } = $props()

    console.log(element)
</script>

<Window title={ capitalize(element.oficial_name) }>
    {#snippet content()}
    <div class="element-box category-{normalize_category(element.category)} fase-{element.fase}">
        <p class="atomic-number">{ element.atomic_number }</p>
        <p class="symbol">{ element.symbol }</p>
        <p class="name">{ element.oficial_name }</p>

        {#if element.atomic_mass}
            <p class="atomic-mass">{ element.atomic_mass } u</p>
        {:else}
            <p class="atomic-mass">desconhecido</p>
        {/if}

        <ul class="layer">
            {#each JSON.parse(element.layers) as layer }
                <li>{ layer }</li>
            {/each}
        </ul>
    </div>
    {/snippet}
</Window>

<style scoped>
.element-box {
	width: 100%;
	min-width: 120px;
	min-height: 120px;
    position: relative;
    padding: 2px;
}

.atomic-number {
	font-size: 14px;
}

.symbol {
	font-size: 32px;
	font-weight: bolder;
	text-align: center;
	padding: 13px 0px;
}

.name {
	font-size: 12px;
	text-align: center;
	width: 100%;
}

.atomic-mass {
	font-size: 13px;
	text-align: center;
}

.layer {
	list-style: none;
	display: flex;
	flex-direction: column;
	text-align: center;
    position: absolute;
    top: 2px;
    right: 4px;
}

.layer li {
	width: 100%;
	font-size: 10px;
	text-align: right;
}
</style>