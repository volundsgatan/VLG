<script lang="ts">
	export let value: string[];
	export let active: boolean;
</script>

<div class="font-medium capitalize" class:underline={active} class:text-gray-500={!active}>
	Gradient
</div>
<div class="flex items-center gap-2" class:underline={active} class:text-gray-500={!active}>
	{#each value as hex}
		<div class="h-4 w-4" style="background-color: {hex}" />
	{/each}
</div>
