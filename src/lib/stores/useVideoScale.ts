import { writable } from 'svelte/store';

const init_scale = 0.7;

const _useVideoScale = writable<number>(init_scale);

const setVideoScale = (newScale: number) => _useVideoScale.set(newScale);
const updateVideoScale = (updater: (currentScale: number) => number) => {
	_useVideoScale.update(updater);
};
const resetVideoScale = () => _useVideoScale.set(init_scale);

export const useVideoScale = {
	subscribe: _useVideoScale.subscribe,
	set: setVideoScale,
	update: updateVideoScale,
	reset: resetVideoScale
};
