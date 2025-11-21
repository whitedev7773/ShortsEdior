import { writable } from 'svelte/store';

const _videoRef = writable<HTMLVideoElement | null>(null);

export const useVideoRef = {
	subscribe: _videoRef.subscribe,
	set: (ref: HTMLVideoElement | null) => _videoRef.set(ref),
	reset: () => _videoRef.set(null)
};
