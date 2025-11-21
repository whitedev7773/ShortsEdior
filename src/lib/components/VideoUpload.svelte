<script lang="ts">
	import { useVideoFile } from '$lib/stores/useVideoFile';

	function handleFileChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		if (!file) return;

		useVideoFile.set(file);
	}
</script>

<div>
	<input type="file" accept="video/*" on:change={handleFileChange} />
</div>
