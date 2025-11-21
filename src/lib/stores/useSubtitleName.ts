import { writable } from 'svelte/store';

const init_subtitle = '여기에 부제목 입력';

const _useSubtitleName = writable<string>(init_subtitle);

const setSubtitle = (newSubtitle: string) => _useSubtitleName.set(newSubtitle);
const updateSubtitle = (updater: (currentSubtitle: string) => string) => {
	_useSubtitleName.update(updater);
};
const clearSubtitle = () => _useSubtitleName.set(init_subtitle);

export const useSubtitleName = {
	subscribe: _useSubtitleName.subscribe,
	set: setSubtitle,
	update: updateSubtitle,
	reset: clearSubtitle
};
