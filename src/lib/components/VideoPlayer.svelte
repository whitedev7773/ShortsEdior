<script lang="ts">
	import { useVideoRef } from '$lib/stores/useVideoRef';

	let status = '재생';
	let videoEl: HTMLVideoElement | null = null;
</script>

<button
	on:click={() => {
		if (!videoEl) {
			videoEl = $useVideoRef;
		}
		if (!videoEl) return;
		if (videoEl.paused) {
			videoEl.play();
			status = '일시정지';
		} else {
			videoEl.pause();
			status = '재생';
		}
	}}
>
	{status}
</button>
