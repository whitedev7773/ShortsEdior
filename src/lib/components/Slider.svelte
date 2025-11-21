<script lang="ts">
	import type { Writable } from 'svelte/store';

	export let label: string = 'Slider';
	export let min: number = 0;
	export let max: number = 100;
	export let step: number = 1;
	export let valueStore: Writable<number>;
</script>

<div id="slider">
	<label for={label}>{label}: {$valueStore}</label>
	<input id={label} name={label} type="range" {min} {max} {step} bind:value={$valueStore} />
</div>

<style>
	#slider {
		display: flex;
		flex-direction: column;
		gap: 8px;
		font-size: 16px;
	}

	input {
		width: 100%;
	}
</style>
