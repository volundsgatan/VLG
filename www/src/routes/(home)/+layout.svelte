<script lang="ts">
	import { onMount } from 'svelte';
	import Spinner from '$lib/ui/Spinner.svelte';
	import { connect, z2mConnected, z2mConnectionError } from '$lib/z2m';
	import { fetchSonos } from '$lib/sonos';

	import '../../app.css';

	onMount(() => {
		connect();
		fetchSonos();

		setInterval(() => {
			fetchSonos();
		}, 5000);
	});
</script>

<svelte:head>
	<title>Westling.life</title>
	<meta name="description" content="Westling.life" />
</svelte:head>

{#if $z2mConnected}
	<slot />
{:else}
	<div class="flex min-h-screen flex-col items-center justify-center gap-16 text-gray-300">
		<div class="text-8xl">❤️🏠</div>
		{#if $z2mConnectionError}
			<div>Nä nu gick något fel hörru! Har du loggat in?</div>
		{:else}
			<Spinner />
		{/if}
	</div>
{/if}
