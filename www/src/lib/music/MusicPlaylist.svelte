<script lang="ts">
	import Spinner from '../Spinner.svelte';

	import { createEventDispatcher } from 'svelte';
	import { sonosRequest } from '../sonos';

	const dispatch = createEventDispatcher();

	export let name: string;
	export let abbr: string | undefined;
	export let image: string | undefined;

	let loading = false;

	const play = async () => {
		loading = true;

		return sonosRequest('TV/favourite/' + encodeURIComponent(name))
			.then(async (data) => {
				await sonosRequest('TV/shuffle/on');
				await sonosRequest('TV/next');
			})

			.then(async (data) => {
				// Join ALL
				await sonosRequest('Five/join/TV');
				await sonosRequest('Kitchen/join/TV');
				dispatch('sonosUpdated', {});
			})

			.catch((err) => {
				console.error(err);
			})

			.finally(() => {
				loading = false;
			});
	};
</script>

<div class="relative overflow-hidden rounded-md">
	{#if loading}
		<div
			class="absolute top-0 left-0 inline-flex h-full w-full items-center justify-center bg-black text-white opacity-80"
		>
			<Spinner />
		</div>
	{/if}

	{#if image}
		<img src={image} class="h-16 w-16 cursor-pointer" on:click|preventDefault={play} />
	{:else}
		<div
			class="inline-flex h-16 w-16 cursor-pointer items-center justify-center bg-stone-500 text-stone-300"
			on:click|preventDefault={play}
		>
			{abbr}
		</div>
	{/if}
</div>
