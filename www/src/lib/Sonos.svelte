<script lang="ts">
	import { Icon, VolumeOff, VolumeUp } from 'svelte-hero-icons';
	import { type State } from './sonosApi';
	import { createEventDispatcher } from 'svelte';
	import Spinner from './Spinner.svelte';

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
				uri.host = 'vlg-pi.volundsgatan.org.github.beta.tailscale.net:8081';
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
			return fetch(
				'http://vlg-pi.volundsgatan.org.github.beta.tailscale.net:5005/' + sonos.name + '/leave'
			)
				.then((res) => res.json())
				.then(() => {
					dispatch('sonosUpdated', {});
				})
				.catch((err) => {
					console.error(err);
				});
		} else {
			return fetch(
				'http://vlg-pi.volundsgatan.org.github.beta.tailscale.net:5005/' + sonos.name + '/join/TV'
			)
				.then((res) => res.json())
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
