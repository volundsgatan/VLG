<script lang="ts">
	import { onMount } from 'svelte';
	import type { State } from '$lib/devices';
	import Fancy from '$lib/Fancy.svelte';
	import Spinner from '$lib/Spinner.svelte';
	import type { State as SonosState, Zone } from '$lib/music/sonos';
	import { sonosRequest } from '$lib/music/sonos';
	import { devices, connect, z2mConnected, z2mConnectionError } from '$lib/z2m';
	import { fetchSonos } from '$lib/sonos';

	import '../app.css';

	onMount(() => {
		connect();

		fetchSonos();

		setInterval(() => {
			fetchSonos();
		}, 5000);
	});
</script>

<svelte:head>
	<title>VLG</title>
	<meta name="description" content="VLG" />
</svelte:head>

{#if z2mConnected}
	<slot />
{:else}
	<div class="flex min-h-screen flex-col items-center justify-center gap-16 text-gray-300">
		<div class="text-8xl">❤️🏠</div>
		{#if z2mConnectionError}
			<div>Nä nu gick något fel hörru! Har du loggat in?</div>
		{:else}
			<Spinner />
		{/if}
	</div>
{/if}
