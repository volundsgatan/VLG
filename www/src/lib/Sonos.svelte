<script lang="ts">
	import { Icon, VolumeOff, VolumeUp } from "svelte-hero-icons";
	import { type Track } from './sonos';

	type State = {
		currentTrack: Track;
		nextTrack: Track;
		elapsedTimeFormatted: string;
		volume: number;
		playbackState: 'STOPPED' | 'PLAYING';
	};

	type SonosInput = {
		name: string;
		state?: State;
	};

	export let track: SonosInput;

	const getArt = (track: TrackState): string | undefined => {
		if (track?.state?.currentTrack?.absoluteAlbumArtUri) {
			return track.state.currentTrack.absoluteAlbumArtUri;
		}
		return undefined;
	};

	$: albumArt = getArt(track);
	$: isPlaying = track?.state?.playbackState === 'PLAYING';

	const toggle = async () => {
		if (isPlaying) {
			return fetch('http://vlg-pi:5005/' + track.name + '/leave')
				.then((res) => res.json())

				.catch((err) => {
					console.error(err);
				});
		} else {
			return fetch('http://vlg-pi:5005/' + track.name + '/join/TV')
				.then((res) => res.json())

				.catch((err) => {
					console.error(err);
				});
		}
	};
</script>

<div on:click|stopPropagation={toggle} class="cursor-pointer h-16 w-16 inline-flex items-center justify-center">
	{#if !isPlaying}
		<Icon src="{VolumeOff}" class="h-12 w-12" />
	{:else if albumArt}
		<img src={albumArt} alt="Album Art" class="h-12 w-12" />
	{:else}
		<Icon src="{VolumeUp}" class="h-12 w-12" />
	{/if}
</div>
