<script lang="ts">
	export let active: boolean | undefined = undefined;

	$: showActive = active !== undefined;
</script>

<div class="inline-flex flex-col items-center">
	<div
		on:click
		class="inline-flex h-12 w-12 cursor-pointer flex-col items-center justify-around rounded-full transition-all delay-100 ease-in-out hover:bg-stone-300"
	>
		<span>
			<slot />
		</span>
	</div>

	{#if showActive}
		<div class="mt-1 -mb-2 h-1 w-1 rounded-full" class:bg-white={active} />
	{/if}
</div>
