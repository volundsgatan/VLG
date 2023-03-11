<script lang="ts">
	export let valid = false;
	export let invalid = false;
	export let guides: number[] = [];
	export let isCol = false;
</script>

<div class="flex" class:flex-col={isCol} class:w-40={!isCol}>
	<div class="flex-1" />

	{#if guides}
		{#each guides as g, gid}
			{@const isLast = gid === guides.length - 1}
			<div class="flex h-8 w-8 flex-shrink-0 items-center justify-center p-1 text-sm text-gray-600">
				<div
					class=" flex h-full w-full items-center  justify-center border-[1px] border-gray-200 "
					class:bg-green-400={valid}
					class:bg-red-400={invalid}
				>
					{g}
				</div>
			</div>
		{/each}
	{/if}
</div>
