<script lang="ts">
	import Spinner from './Spinner.svelte';

	export let name: string;
	export let abbr: string | undefined;
	export let image: string | undefined;

	let loading = false;

	const play = async () => {
		loading = true;

		return fetch('http://vlg-pi:5005/TV/favourite/' + name)
			.then((res) => res.json())

			.then(async (data) => {
				await fetch('http://vlg-pi:5005/TV/shuffle/on');
				await fetch('http://vlg-pi:5005/TV/next');
			})

			.then(async (data) => {
				// Join ALL
				await fetch('http://vlg-pi:5005/Five/join/TV');
				await fetch('http://vlg-pi:5005/Kitchen/join/TV');
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
			class="opacity-80 bg-black absolute inline-flex items-center top-0 left-0 w-full h-full justify-center"
		>
			<Spinner />
		</div>
	{/if}

	{#if image}
		<img src={image} class="h-28 w-28 cursor-pointer" on:click|preventDefault={play} />
	{:else}
		<div
			class="cursor-pointer bg-red-200 h-28 w-28 text-red-600 text-2xl justify-center inline-flex items-center"
			on:click|preventDefault={play}
		>
			{abbr}
		</div>
	{/if}
</div>
