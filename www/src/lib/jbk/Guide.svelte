<script lang="ts">
	export let valid = false;
	export let invalid = false;
	export let guides: number[] = [];
	export let isCol = false;
	export let rowGuideWidth: number;
	export let selected: boolean;
	export let tiny: boolean;

	$: style = isCol ? '' : `width: ${rowGuideWidth}px`;
</script>

<div class="flex select-none " class:flex-col={isCol} {style}>
	<div class="flex-1" />

	{#if guides}
		{#each guides as g, gid}
			{@const isLast = gid === guides.length - 1}
			<div
				class="flex flex-shrink-0 items-center justify-center p-0.5 text-xs text-gray-600"
				class:h-6={!tiny}
				class:w-6={!tiny}
				class:h-4={tiny}
				class:w-4={tiny}
			>
				<div
					class="flex h-full w-full items-center  justify-center border-[1px] border-gray-200 "
					class:bg-green-400={valid}
					class:bg-red-400={invalid}
					class:bg-blue-200={selected}
				>
					{g}
				</div>
			</div>
		{/each}
	{/if}
</div>
