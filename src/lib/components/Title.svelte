<script lang="ts">
	import { useTitleName } from '$lib/stores/useTitleName';
	import { useTitleItalic } from '$lib/stores/useTitleItalic';

	const text = useTitleName;
	const italic = useTitleItalic;
</script>

<h1 id="player-title" class:italic={$italic}>
	{@html $text ? $text.replace(/\n/g, '<br/>') : ''}
</h1>

<style>
	@font-face {
		font-family: 'Aggravo';
		src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2108@1.1/SBAggroB.woff')
			format('woff');
		font-weight: 700;
		font-display: swap;
	}

	#player-title {
		font-family: 'Aggravo', sans-serif;
		font-size: 90px;
		text-align: center;
		/* font-style: italic; */
		color: white;
	}

	.italic {
		font-style: italic;
	}
</style>
