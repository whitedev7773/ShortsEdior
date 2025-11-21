import { writable } from 'svelte/store';

const init_title = '여기에 제목 입력';

const _useTitleName = writable<string>(init_title);

const setTitle = (newTitle: string) => _useTitleName.set(newTitle);
const updateTitle = (updater: (currentTitle: string) => string) => {
	_useTitleName.update(updater);
};
const clearTitle = () => _useTitleName.set(init_title);

export const useTitleName = {
	subscribe: _useTitleName.subscribe,
	set: setTitle,
	update: updateTitle,
	clear: clearTitle
};
