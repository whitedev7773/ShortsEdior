import { writable } from 'svelte/store';

import example from '$lib/assets/example.mp4';

const fallbackVideo = example; // 기본 비디오

// 업로드한 File 객체를 저장. null이면 기본 비디오를 사용
const _videoFile = writable<File | null>(null);

const setVideoFile = (file: File | null) => _videoFile.set(file);
const updateVideoFile = (updater: (currentFile: File | null) => File | null) => {
	_videoFile.update(updater);
};
const resetVideoFile = () => _videoFile.set(null);

export const useVideoFile = {
	subscribe: _videoFile.subscribe,
	set: setVideoFile,
	update: updateVideoFile,
	reset: resetVideoFile,
	fallback: fallbackVideo
};
