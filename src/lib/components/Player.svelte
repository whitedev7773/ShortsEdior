<script lang="ts">
	import Title from './Title.svelte';
	import Video from './Video.svelte';
	import Subtitle from './Subtitle.svelte';

	import { onMount } from 'svelte';
	import { usePreviewRef } from '$lib/stores/usePreviewRef';

	let previewRef: HTMLDivElement;

	onMount(() => {
		usePreviewRef.set(previewRef);
	});
</script>

<div bind:this={previewRef} id="player">
	<Title />
	<Video />
	<Subtitle />
	<span style="height: 50px; opacity: 0;">gap</span>
</div>

<style>
	#player {
		user-select: none;

		width: 1080px;
		height: 1920px;
		background-color: #000;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 40px;

		overflow: hidden;
	}
</style>
