import html2canvas from 'html2canvas';
import { FFmpeg } from '@ffmpeg/ffmpeg';

import { useRenderProgress } from '$lib/stores/useRenderProgress';

interface HTMLVideoElementWithCapture extends HTMLVideoElement {
	captureStream(): MediaStream;
}

export async function createVideoRender(preview: HTMLDivElement, sourceVideo: HTMLVideoElement) {
	let recorder: MediaRecorder | null = null;
	let canvasStream: MediaStream | null = null;
	let recordInterval: NodeJS.Timeout | null = null;
	let recording = false;

	const cleanup = () => {
		recording = false;

		if (recordInterval) {
			clearInterval(recordInterval);
			recordInterval = null;
		}

		if (recorder && recorder.state !== 'inactive') {
			recorder.stop();
		}

		if (canvasStream) {
			canvasStream.getTracks().forEach((track) => track.stop());
			canvasStream = null;
		}

		if (sourceVideo) {
			sourceVideo.pause();
			sourceVideo.currentTime = 0;
		}
	};

	try {
		useRenderProgress.reset();
		useRenderProgress.setStatus('recording');
		useRenderProgress.setProgress(5, '녹화 준비 중...');

		const rect = preview.getBoundingClientRect();
		const canvas = document.createElement('canvas');
		canvas.width = rect.width;
		canvas.height = rect.height;
		const ctx = canvas.getContext('2d');

		if (!ctx) {
			throw new Error('Canvas context를 생성할 수 없습니다');
		}

		recording = true;

		const fps = 30;
		let elapsed = 0;
		const RECORD_TIME = 5000;

		const renderLoop = async () => {
			if (!recording) return;

			try {
				const bmp = await html2canvas(preview, {
					backgroundColor: null,
					useCORS: true,
					logging: false
				});

				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);

				requestAnimationFrame(renderLoop);
			} catch (error) {
				console.error('html2canvas 렌더링 오류:', error);
				recording = false;
			}
		};

		canvasStream = canvas.captureStream(fps);

		sourceVideo.muted = false;
		sourceVideo.volume = 1;
		sourceVideo.currentTime = 0;

		await new Promise<void>((res, rej) => {
			const onCanPlay = () => {
				sourceVideo.removeEventListener('canplay', onCanPlay);
				sourceVideo.removeEventListener('error', onError);
				res();
			};
			const onError = () => {
				sourceVideo.removeEventListener('canplay', onCanPlay);
				sourceVideo.removeEventListener('error', onError);
				rej(new Error('비디오 로드 실패'));
			};

			sourceVideo.addEventListener('canplay', onCanPlay);
			sourceVideo.addEventListener('error', onError);
		});

		await sourceVideo.play();

		const videoStream = (sourceVideo as HTMLVideoElementWithCapture).captureStream();
		const audioTracks = videoStream.getAudioTracks();
		if (audioTracks.length > 0) {
			canvasStream.addTrack(audioTracks[0]);
		}

		await new Promise((r) => setTimeout(r, 300));

		renderLoop();

		const mimeType = MediaRecorder.isTypeSupported('video/webm; codecs=vp9')
			? 'video/webm; codecs=vp9'
			: 'video/webm';

		recorder = new MediaRecorder(canvasStream, { mimeType });

		const chunks: BlobPart[] = [];

		recorder.ondataavailable = (e) => {
			if (e.data.size > 0) {
				chunks.push(e.data);
			}
		};

		recordInterval = setInterval(() => {
			elapsed += 100;
			const percent = Math.min(30, (elapsed / RECORD_TIME) * 30);
			useRenderProgress.setProgress(percent, '영상 캡처 중...');
		}, 100);

		recorder.onerror = () => {
			cleanup();
			throw new Error('녹화 중 오류 발생');
		};

		const recordingPromise = new Promise<void>((resolve, reject) => {
			if (!recorder) {
				reject(new Error('Recorder가 초기화되지 않았습니다'));
				return;
			}

			recorder.onstop = async () => {
				if (recordInterval) {
					clearInterval(recordInterval);
					recordInterval = null;
				}
				recording = false;

				try {
					console.log('🎬 녹화 완료, 청크 개수:', chunks.length);

					useRenderProgress.setStatus('loading-ffmpeg');
					useRenderProgress.setProgress(33, 'FFmpeg 로딩 중...');

					if (chunks.length === 0) {
						throw new Error('녹화된 데이터가 없습니다');
					}

					const webmBlob = new Blob(chunks, { type: 'video/webm' });
					const webmBytes = new Uint8Array(await webmBlob.arrayBuffer());

					console.log('📦 WebM 크기:', webmBytes.length, 'bytes');

					const ffmpeg = new FFmpeg();

					ffmpeg.on('log', ({ type, message }) => {
						console.log(`[ffmpeg-${type}] ${message}`);
					});

					ffmpeg.on('progress', ({ progress, time }) => {
						const p = 40 + progress * 50;
						useRenderProgress.setStatus('encoding');
						useRenderProgress.setProgress(
							p,
							`mp4 인코딩 중... (${(time / 1_000_000).toFixed(1)}s)`
						);
					});

					console.log('⏳ FFmpeg 로딩 시작...');

					try {
						// 절대 경로 사용 (origin 포함)
						const baseURL = `${window.location.origin}/ffmpeg`;

						console.log('📁 FFmpeg 파일 경로:', baseURL);

						// 파일 존재 확인
						const coreResponse = await fetch(`${baseURL}/ffmpeg-core.js`, { method: 'HEAD' });
						const wasmResponse = await fetch(`${baseURL}/ffmpeg-core.wasm`, { method: 'HEAD' });

						if (!coreResponse.ok) {
							throw new Error(`ffmpeg-core.js 접근 불가 (${coreResponse.status})`);
						}
						if (!wasmResponse.ok) {
							throw new Error(`ffmpeg-core.wasm 접근 불가 (${wasmResponse.status})`);
						}

						console.log('✅ FFmpeg 파일 확인 완료');
						console.log('📥 FFmpeg 로딩 시작...');

						// 직접 URL 전달 (Blob URL 사용 안 함)
						await Promise.race([
							ffmpeg.load({
								coreURL: `${baseURL}/ffmpeg-core.js`,
								wasmURL: `${baseURL}/ffmpeg-core.wasm`
								// workerURL을 명시적으로 제거
							}),
							new Promise((_, reject) =>
								setTimeout(() => reject(new Error('FFmpeg 로딩 타임아웃 (90초)')), 90000)
							)
						]);

						console.log('✅ FFmpeg 로딩 성공!');
					} catch (error) {
						console.error('❌ FFmpeg 로딩 실패:', error);
						console.error('에러 상세:', error);
						throw new Error(`FFmpeg 로딩 실패: ${(error as Error).message}`);
					}

					useRenderProgress.setStatus('encoding');
					useRenderProgress.setProgress(55, 'webm → mp4 변환 중...');

					console.log('📝 파일 쓰기 시작...');
					await ffmpeg.writeFile('input.webm', webmBytes);

					console.log('🎞️ FFmpeg 인코딩 시작...');
					await ffmpeg.exec([
						'-i',
						'input.webm',
						'-c:v',
						'libx264',
						'-c:a',
						'aac',
						'-preset',
						'ultrafast',
						'-crf',
						'23',
						'-movflags',
						'+faststart',
						'output.mp4'
					]);

					console.log('📤 파일 읽기 시작...');
					const out = await ffmpeg.readFile('output.mp4');

					useRenderProgress.setProgress(95, '다운로드 준비 중...');

					const mp4Data = out instanceof Uint8Array ? out : new Uint8Array(out as ArrayBuffer);
					console.log('✅ MP4 크기:', mp4Data.length, 'bytes');

					const mp4Blob = new Blob([mp4Data], { type: 'video/mp4' });

					const url = URL.createObjectURL(mp4Blob);
					const a = document.createElement('a');
					a.href = url;
					a.download = `rendered-${Date.now()}.mp4`;
					document.body.appendChild(a);
					a.click();
					document.body.removeChild(a);

					setTimeout(() => URL.revokeObjectURL(url), 1000);

					useRenderProgress.setProgress(100, '완료!');
					useRenderProgress.setStatus('done');

					console.log('🎉 모든 작업 완료!');

					cleanup();
					resolve();
				} catch (error) {
					console.error('❌ 처리 중 오류:', error);
					cleanup();
					reject(error);
				}
			};
		});

		recorder.start();

		setTimeout(() => {
			if (recorder && recorder.state === 'recording') {
				recorder.stop();
			}
		}, RECORD_TIME);

		await recordingPromise;
	} catch (error) {
		console.error('❌ createVideoRender 오류:', error);
		cleanup();
		throw error;
	}
}
