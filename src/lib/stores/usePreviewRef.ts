import { writable } from 'svelte/store';

const _previewRef = writable<HTMLDivElement | null>(null);

export const usePreviewRef = {
	subscribe: _previewRef.subscribe,
	set: (ref: HTMLDivElement | null) => _previewRef.set(ref),
	reset: () => _previewRef.set(null)
};
