<script lang="ts">
	export let name: string;
	export let value: string | number | boolean;
	export let unit: string | null = null;
</script>

<div class="font-medium capitalize">{name}</div>
<div>
	<span class="font-medium">{value}</span>
	{#if unit}<span class="text-gray-400">{unit}</span>{/if}
</div>
