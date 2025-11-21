import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sourceDir = join(__dirname, '../node_modules/@ffmpeg/core/dist/umd');
const targetDir = join(__dirname, '../static/ffmpeg'); // SvelteKit의 경우 static 폴더

// 디렉토리가 없으면 생성
if (!existsSync(targetDir)) {
	mkdirSync(targetDir, { recursive: true });
}

// 필요한 파일들 복사
const files = ['ffmpeg-core.js', 'ffmpeg-core.wasm', 'ffmpeg-core.worker.js'];

files.forEach((file) => {
	const source = join(sourceDir, file);
	const target = join(targetDir, file);

	try {
		copyFileSync(source, target);
		console.log(`✅ Copied: ${file}`);
	} catch (error) {
		console.error(`❌ Failed to copy ${file}:`, error.message);
	}
});

console.log('🎉 FFmpeg files copied successfully!');
