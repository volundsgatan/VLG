<script lang="ts">
	import { Icon, VolumeOff, VolumeUp } from 'svelte-hero-icons';
	import { type State } from '../sonosTypes';
	import { createEventDispatcher } from 'svelte';
	import Spinner from '../Spinner.svelte';
	import { sonosRequest, hostname } from '../sonos';

	const dispatch = createEventDispatcher();

	export let sonos: State;
	export let name: string;
	export let sonosIsUpdating = false;

	const getArt = (sonos: State): string | undefined => {
		if (sonos?.currentTrack?.absoluteAlbumArtUri) {
			let uri = new URL(sonos?.currentTrack?.absoluteAlbumArtUri);

			if (uri.protocol === 'http:') {
				uri.protocol = 'https';
				uri.host = hostname;
				uri.port = '443';
				uri.pathname = `${uri.pathname}`;
			}

			return uri.toString();
		}
		return undefined;
	};

	$: albumArt = getArt(sonos);
	$: isPlaying = sonos?.playbackState === 'PLAYING';

	const toggle = async () => {
		if (isPlaying) {
			return sonosRequest(name + '/leave')
				.then(() => {
					dispatch('sonosUpdated', {});
				})
				.catch((err) => {
					console.error(err);
				});
		} else {
			return sonosRequest(name + '/join/TV')
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
	{:else if isPlaying && albumArt}
		<img src={albumArt} alt="Album Art" class="h-12 w-12" />
	{:else if isPlaying}
		<div class="text-3xl">📺</div>
	{/if}
</div>
