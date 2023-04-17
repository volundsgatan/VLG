<script lang="ts">
	import Spinner from '$lib/ui/Spinner.svelte';
	import { createEventDispatcher } from 'svelte';
	import { sonosRequest } from './sonos';
	import config from '$lib/config';

	const dispatch = createEventDispatcher();

	export let name: string;
	export let abbr: string | undefined;
	export let image: string | undefined;

	let loading = false;

	const firstSonos = config.sonos.devices[0];

	const play = async () => {
		loading = true;

		return sonosRequest(`${firstSonos}/favourite/${encodeURIComponent(name)}`)
			.then(async (data) => {
				await sonosRequest(`${firstSonos}/shuffle/on`);
				await sonosRequest(`${firstSonos}/next`);
			})

			.then(async (data) => {
				// Join ALL
				for (const name of config.sonos.devices) {
					if (name === firstSonos) {
						continue;
					}

					await sonosRequest(`${name}/join/${firstSonos}`);
				}

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

	{#if abbr}
		<div
			class="bg-cover inline-flex h-16 w-16 cursor-pointer items-center justify-center bg-stone-500 text-stone-300"
			on:click|preventDefault={play}
			on:keyup={play}
		>
			{abbr}
		</div>
	{:else if image}
		<img
			src={image}
			class="h-16 w-16 cursor-pointer"
			alt="Album art"
			on:click|preventDefault={play}
			on:keyup={play}
		/>
	{/if}
</div>
