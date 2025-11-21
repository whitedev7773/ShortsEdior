<script lang="ts">
	export let title: string;
</script>

<div id="panel-container">
	<h3>{title}</h3>
	<slot></slot>
</div>

<style>
	#panel-container {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding: 16px;
		border: 1.5px solid rgb(228, 228, 228);
		border-radius: 12px;
		background-color: #fafafa;
	}
</style>
