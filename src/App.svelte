<script lang="ts">
    import { mount } from "svelte"
    import { get_main } from "./lib/helpers"
	import Shortcut from "./lib/features/Shortcut.svelte"

	import icon_periodic_table from './assets/icon_periodic_table.svg'

    import PeriodicTable from "./lib/windows/PeriodicTable.svelte"
    import LinusPauling from "./lib/windows/LinusPauling.svelte"
</script>

<main id="main">
	<Shortcut
		title="Tabela Periódica"
		icon={icon_periodic_table}
		onclick={() => mount(PeriodicTable, { target: get_main() })}/>

	<LinusPauling/>
</main>

<style scoped>
#main {
	width: 100%;
	height: 100%;

    position: relative;

	padding: 10px;
	display: grid;
	grid-template-columns: repeat(auto-fit, 120px);
	grid-template-rows:  repeat(auto-fit, 120px);
	gap: auto;

    background-color: #f0eadc;
}
</style>