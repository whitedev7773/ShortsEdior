<script lang="ts">
	import PanelContainer from './PanelContainer.svelte';

	import TextlineInput from '$lib/components/TextlineInput.svelte';
	import Toggle from '$lib/components/Toggle.svelte';
	import Slider from '$lib/components/Slider.svelte';

	import VideoUpload from './VideoUpload.svelte';
	import VideoPlayer from './VideoPlayer.svelte';
	import RenderProgress from './RenderProgress.svelte';

	import { useTitleName } from '$lib/stores/useTitleName';
	import { useTitleItalic } from '$lib/stores/useTitleItalic';
	import { useSubtitleName } from '$lib/stores/useSubtitleName';
	import { useVideoScale } from '$lib/stores/useVideoScale';
	import { usePreviewScale } from '$lib/stores/usePreviewScale';

	import { usePreviewRef } from '$lib/stores/usePreviewRef';
	import { useVideoRef } from '$lib/stores/useVideoRef';
	import { createVideoRender } from '$lib/utils/videoRenderer';
	import { get } from 'svelte/store';

	const title = useTitleName;
	const title_italic = useTitleItalic;
	const subtitle = useSubtitleName;
	const videoScale = useVideoScale;
	const previewScale = usePreviewScale;

	// 영상 다운로드 레퍼런스
	let previewRef: HTMLDivElement | null = null;
	let videoEl: HTMLVideoElement | null = null;

	// 스토어 구독
	const unsubscribe = usePreviewRef.subscribe((v) => {
		previewRef = v;
	});

	const unsubscribeVideo = useVideoRef.subscribe((v) => {
		videoEl = v;
	});

	let memory_scale = get(previewScale);

	async function handleRender() {
		if (!previewRef || !videoEl) {
			alert('렌더링할 Preview 영역을 찾을 수 없습니다.');
			return;
		}

		previewScale.set(1);
		await createVideoRender(previewRef, videoEl).then(() => {
			previewScale.set(memory_scale);
		});
	}
</script>

<div id="control-panel">
	<!-- Title TextlineInput -->
	<!-- Title Italic Toggle -->
	<PanelContainer title="제목 설정">
		<TextlineInput id="title-input" textStore={title} />
		<Toggle label="기울임체" toggleStore={title_italic} />
	</PanelContainer>

	<PanelContainer title="부제목 설정">
		<!-- Subtitle TextlineInput -->
		<TextlineInput id="subtitle-input" textStore={subtitle} />
	</PanelContainer>

	<PanelContainer title="비디오 크기 설정">
		<!-- Video File Scale Slider -->
		<Slider label="비디오 크기" min={0.3} max={1} step={0.05} valueStore={videoScale} />
		<p>영상의 통일성을 위해 크기를 고정하세요</p>
		<VideoUpload />
		<VideoPlayer />
	</PanelContainer>

	<PanelContainer title="미리보기 박스 크기 설정">
		<!-- Preview Box Scale Slider -->
		<Slider label="미리보기 박스 크기" min={0.3} max={1} step={0.01} valueStore={previewScale} />
		<p>이 설정은 렌더링 영향 없음</p>
	</PanelContainer>

	<PanelContainer title="렌더링">
		<button on:click={handleRender}>동영상 렌더링 및 다운로드</button>
		<RenderProgress />
	</PanelContainer>
</div>

<style>
	#control-panel {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 24px;
	}
</style>
