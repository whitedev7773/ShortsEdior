<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	import { useVideoFile } from '$lib/stores/useVideoFile';
	import { useVideoScale } from '$lib/stores/useVideoScale';

	import { useVideoRef } from '$lib/stores/useVideoRef';

	const videoScale = useVideoScale;

	let currentUrl: string | null = null;

	let file: File | null = null;
	const unsubscribe = useVideoFile.subscribe((v) => {
		file = v;

		// 기존 URL 정리
		if (currentUrl) {
			URL.revokeObjectURL(currentUrl);
			currentUrl = null;
		}

		// 새 파일이 있으면 URL 생성
		if (file) {
			currentUrl = URL.createObjectURL(file);
		}
	});

	let videoRef: HTMLVideoElement;

	onMount(() => {
		useVideoRef.set(videoRef);
	});

	onDestroy(() => {
		unsubscribe();
		if (currentUrl) URL.revokeObjectURL(currentUrl);
	});
</script>

<!-- svelte-ignore a11y_media_has_caption -->
<video
	loop
	bind:this={videoRef}
	style="width: {$videoScale * 2 * 1080}px;"
	src={file ? currentUrl! : useVideoFile.fallback}
></video>
