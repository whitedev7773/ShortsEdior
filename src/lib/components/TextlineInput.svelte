<script lang="ts">
	import type { Writable } from 'svelte/store';

	export let id: string = 'textline-input';
	export let textStore: Writable<string>;
</script>

<textarea
	{id}
	bind:value={$textStore}
	placeholder="Enter text here"
	style="width: 100%; padding: 8px; font-size: 16px;"
></textarea>

<style>
	textarea {
		width: 100%;
		height: 80px;
		resize: none;
	}
</style>
