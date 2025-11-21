<script lang="ts">
	import Player from '$lib/components/Player.svelte';
	import ControlPanel from '$lib/components/ControlPanel.svelte';

	import { usePreviewScale } from '$lib/stores/usePreviewScale';
</script>

<div id="main-container" style="display: flex; gap: 24px; width: fit-content;">
	<div id="control-panel-container">
		<ControlPanel />
	</div>
	<div
		id="player-container"
		style="transform: scale({$usePreviewScale}); transform-origin: top left;"
	>
		<Player />
	</div>
</div>

<style>
	:global(*) {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	#main-container {
		padding: 20px;
	}

	#control-panel-container {
		width: 350px;
	}

	#player-container {
		width: fit-content;
		height: fit-content;
		padding: 16px;
		border: 1.5px solid rgb(228, 228, 228);
		border-radius: 12px;

		transition: transform 0.1s ease-out;
	}
</style>
