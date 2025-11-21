<script lang="ts">
	import type { Writable } from 'svelte/store';

	export let label: string = 'label';
	export let toggleStore: Writable<boolean>;
</script>

<!-- Create Switch Styled Toggle -->
<div id="toggle">
	<span style="margin-left: 8px;">{label}</span>
	<label class="switch">
		<input id="toggle" type="checkbox" bind:checked={$toggleStore} />
		<span class="slider round"></span>
	</label>
</div>

<style>
	#toggle {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		font-size: 16px;
	}

	.switch {
		position: relative;
		display: inline-block;
		width: 40px;
		height: 24px;
	}

	.switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #ccc;
		transition: 0.4s;
		border-radius: 24px;
	}

	.slider:before {
		position: absolute;
		content: '';
		height: 16px;
		width: 16px;
		left: 4px;
		bottom: 4px;
		background-color: white;
		transition: 0.4s;
		border-radius: 50%;
	}

	input:checked + .slider {
		background-color: #2196f3;
	}

	input:checked + .slider:before {
		transform: translateX(16px);
	}
</style>
