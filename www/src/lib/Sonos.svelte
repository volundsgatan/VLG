<script lang="ts">
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
	export let icon: String = '🔉';

	const getTitle = (track: SonosInput): string | undefined => {
		if (track?.state?.currentTrack?.title) {
			return track.state.currentTrack.title;
		}

		if (track?.state?.currentTrack?.stationName) {
			return track.state.currentTrack.stationName;
		}

		if (track?.state?.currentTrack?.type === 'line_in') {
			return 'Line In';
		}

		return undefined;
	};

	const getArt = (track: TrackState): string | undefined => {
		if (track?.state?.currentTrack?.absoluteAlbumArtUri) {
			return track.state.currentTrack.absoluteAlbumArtUri;
		}
		return undefined;
	};

	$: title = getTitle(track);
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

<div on:click|stopPropagation={toggle} class="inline-flex cursor-pointer items-center space-x-2">
	{#if !isPlaying}
		<span>🔇</span>
	{:else if albumArt}
		<img src={albumArt} alt="Album Art" class="h-8 w-8" />
	{:else if title}
		<span class="overflow-hidden text-sm">{title}</span>
	{:else}
		<span>{icon}</span>
	{/if}
</div>
