<script lang="ts">
	import { useSubtitleName } from '$lib/stores/useSubtitleName';

	const text = useSubtitleName;
</script>

<h1 id="player-subtitle">
	{@html $text ? $text.replace(/\n/g, '<br/>') : ''}
</h1>

<style>
	@font-face {
		font-family: 'Pretendard';
		src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-Bold.woff2')
			format('woff2');
		font-weight: 700;
		font-display: swap;
	}

	#player-subtitle {
		font-family: 'Pretendard', sans-serif;
		font-size: 46px;
		text-align: center;
		color: white;
	}
</style>
