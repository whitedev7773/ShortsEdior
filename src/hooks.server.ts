import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// FFmpeg을 위한 특별 처리
	if (event.url.pathname.startsWith('/ffmpeg/')) {
		const response = await resolve(event);

		// SharedArrayBuffer를 위한 필수 헤더
		response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
		response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
		response.headers.set('Cross-Origin-Resource-Policy', 'cross-origin');

		return response;
	}

	const response = await resolve(event);

	// 모든 페이지에 SharedArrayBuffer 지원 헤더 추가
	response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
	response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');

	return response;
};
