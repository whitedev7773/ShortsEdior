import { writable } from 'svelte/store';

export interface RenderProgressState {
	percent: number;
	status: 'idle' | 'recording' | 'loading-ffmpeg' | 'encoding' | 'done';
	message: string;
}

const init: RenderProgressState = {
	percent: 0,
	status: 'idle',
	message: ''
};

const _progress = writable<RenderProgressState>(init);

export const useRenderProgress = {
	subscribe: _progress.subscribe,

	setProgress(percent: number, message: string) {
		_progress.update((prev) => ({
			...prev,
			percent,
			message
		}));
	},

	setStatus(status: RenderProgressState['status']) {
		_progress.update((prev) => ({
			...prev,
			status
		}));
	},

	reset() {
		_progress.set(init);
	}
};
