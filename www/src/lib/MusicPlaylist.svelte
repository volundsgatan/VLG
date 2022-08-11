<script lang="ts">
	import Spinner from './Spinner.svelte';

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let name: string;
	export let abbr: string | undefined;
	export let image: string | undefined;

	let loading = false;

	const play = async () => {
		loading = true;

		return fetch('http://vlg-pi.volundsgatan.org.github.beta.tailscale.net:5005/TV/favourite/' + name)
			.then((res) => res.json())

			.then(async (data) => {
				await fetch('http://vlg-pi.volundsgatan.org.github.beta.tailscale.net:5005/TV/shuffle/on');
				await fetch('http://vlg-pi.volundsgatan.org.github.beta.tailscale.net:5005/TV/next');
			})

			.then(async (data) => {
				// Join ALL
				await fetch('http://vlg-pi.volundsgatan.org.github.beta.tailscale.net:5005/Five/join/TV');
				await fetch('http://vlg-pi.volundsgatan.org.github.beta.tailscale.net:5005/Kitchen/join/TV');
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

<div class="relative">
	{#if loading}
		<div
			class="absolute top-0 left-0 inline-flex h-full w-full items-center justify-center bg-black text-white opacity-80"
		>
			<Spinner />
		</div>
	{/if}

	{#if image}
		<img src={image} class="h-28 w-28 cursor-pointer" on:click|preventDefault={play} />
	{:else}
		<div
			class="inline-flex h-28 w-28 cursor-pointer items-center justify-center bg-red-200 text-2xl text-red-600"
			on:click|preventDefault={play}
		>
			{abbr}
		</div>
	{/if}
</div>
