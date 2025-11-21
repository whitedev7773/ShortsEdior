import { writable } from 'svelte/store';

const init_italic = true;

const _useTitleItalic = writable<boolean>(init_italic);

const setTitleItalic = (newItalic: boolean) => _useTitleItalic.set(newItalic);
const updateTitleItalic = (updater: (currentItalic: boolean) => boolean) => {
	_useTitleItalic.update(updater);
};
const resetTitleItalic = () => _useTitleItalic.set(init_italic);

export const useTitleItalic = {
	subscribe: _useTitleItalic.subscribe,
	set: setTitleItalic,
	update: updateTitleItalic,
	reset: resetTitleItalic
};
