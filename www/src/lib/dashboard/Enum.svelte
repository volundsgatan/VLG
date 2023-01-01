<script lang="ts">
	export let values: string[];
	export let value: string | null;
	export let name: string;
</script>

<div class="font-medium capitalize" >
	{name} - {value}
</div>
<div class="flex gap-2 flex-col ">
	{#each values as value}
		<div>{value}</div>
	{/each}
</div>
