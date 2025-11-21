<script lang="ts">
	import { useRenderProgress, type RenderProgressState } from '$lib/stores/useRenderProgress';
	let progress: RenderProgressState;
	useRenderProgress.subscribe((v) => (progress = v));
</script>

{#if progress.status !== 'idle'}
	<div id="render-progress">
		<div class="bar">
			<div class="fill" style="width: {progress.percent}%;"></div>
		</div>
		<p>{progress.percent.toFixed(0)}% — {progress.message}</p>
	</div>
{/if}

<style>
	#render-progress {
		padding: 12px;
		background: #111;
		border-radius: 8px;
		color: white;
		font-size: 14px;
	}

	.bar {
		width: 100%;
		height: 10px;
		background: #333;
		border-radius: 5px;
		margin-bottom: 6px;
		overflow: hidden;
	}

	.fill {
		height: 10px;
		background: linear-gradient(90deg, #00d9ff, #0099ff);
		transition: width 0.2s ease-out;
	}
</style>
