<script lang="ts">
	import { Icon, VolumeOff, VolumeUp } from 'svelte-hero-icons';
	import { type State } from '../sonosTypes';
	import { createEventDispatcher } from 'svelte';
	import Spinner from '../Spinner.svelte';
	import { sonosRequest, hostname } from '../sonos';

	const dispatch = createEventDispatcher();

	type Sonos = {
		name: string;
		state?: State;
	};

	export let sonos: Sonos;
	export let sonosIsUpdating = false;

	const getArt = (sonos: Sonos): string | undefined => {
		if (sonos?.state?.currentTrack?.absoluteAlbumArtUri) {
			let uri = new URL(sonos?.state?.currentTrack?.absoluteAlbumArtUri);

			if (uri.protocol === 'http:') {
				uri.protocol = 'https';
				uri.host = hostname;
				uri.port = '443'
				uri.pathname = `/sonos${uri.pathname}`;
			}

			return uri.toString();
		}
		return undefined;
	};

	$: albumArt = getArt(sonos);
	$: isPlaying = sonos?.state?.playbackState === 'PLAYING';

	const toggle = async () => {
		if (isPlaying) {
			return sonosRequest(sonos.name + '/leave')
				.then(() => {
					dispatch('sonosUpdated', {});
				})
				.catch((err) => {
					console.error(err);
				});
		} else {
			return sonosRequest(sonos.name + '/join/TV')
				.then(() => {
					dispatch('sonosUpdated', {});
				})
				.catch((err) => {
					console.error(err);
				});
		}
	};
</script>

<div
	on:click|stopPropagation={toggle}
	class="inline-flex h-16 w-16 cursor-pointer items-center justify-center"
>
	{#if !isPlaying && sonosIsUpdating}
		<Spinner />
	{:else if !isPlaying}
		<Icon src={VolumeOff} class="h-6 w-6" />
	{:else if albumArt}
		<img src={albumArt} alt="Album Art" class="h-12 w-12" />
	{:else}
		<Icon src={VolumeUp} class="h-12 w-12" />
	{/if}
</div>
