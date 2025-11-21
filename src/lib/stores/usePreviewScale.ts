import { writable } from 'svelte/store';

const init_scale = 0.5;

const _usePreviewScale = writable<number>(init_scale);

const setPreviewScale = (newScale: number) => _usePreviewScale.set(newScale);
const updatePreviewScale = (updater: (currentScale: number) => number) => {
	_usePreviewScale.update(updater);
};
const resetPreviewScale = () => _usePreviewScale.set(init_scale);

export const usePreviewScale = {
	subscribe: _usePreviewScale.subscribe,
	set: setPreviewScale,
	update: updatePreviewScale,
	reset: resetPreviewScale
};
