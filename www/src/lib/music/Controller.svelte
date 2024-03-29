<script lang="ts">
	import { type Zone, sonosRequest } from './sonos';
	import Button from './Button.svelte';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import config from '$lib/config';

	const dispatch = createEventDispatcher();

	export let zone: Zone;
	$: rooms = zone.members.map((m) => m.roomName);

	const sonoses = config.sonos.devices;

	const command = (cmd: string) => {
		return sonosRequest(`${zone.coordinator.roomName}/${cmd}`)
			.then((res) => res.json())
			.then(() => dispatch('sonosUpdated', {}));
	};

	const next = () => {
		return command('next');
	};
	const playpause = () => {
		return command('playpause');
	};
	const previous = () => {
		return command('previous');
	};
	const broadcast = () => {
		const otherSonoses = sonoses.filter((n) => n !== zone.coordinator.roomName);
		const joins = otherSonoses.map((n) => command(`add/${n}`));
		return Promise.all(joins);
	};
	const shuffle = () => {
		if (isShuffle) {
			return command('shuffle/off');
		} else {
			return command('shuffle/on');
		}
	};

	$: hasTitleAndAlbum =
		zone.coordinator.state.currentTrack.title && zone.coordinator.state.currentTrack.album;

	const getArt = (z: Zone): string | undefined => {
		if (zone.coordinator.state.currentTrack.absoluteAlbumArtUri) {
			let uri = new URL(zone.coordinator.state.currentTrack.absoluteAlbumArtUri);

			if (uri.protocol === 'http:') {
				uri.protocol = 'https';
				uri.host = 'sonos.unicorn-alligator.ts.net';
				uri.port = '443';
				uri.pathname = `${uri.pathname}`;
			}

			return uri.toString();
		}
		return undefined;
	};

	$: albumArt = getArt(zone);

	let volume = 0;
	onMount(() => {
		volume = zone.coordinator.state.volume;
	});
	const volumeInterval = setInterval(() => {
		volume = zone.coordinator.state.volume;
	}, 5000);
	onDestroy(() => clearInterval(volumeInterval));

	const onSetVolume = () => {
		return command(`groupVolume/${volume}`);
	};

	const toggleMute = () => {
		if (volume === 0) {
			return command(`groupVolume/10`);
		} else {
			return command(`groupVolume/0`);
		}
	};

	$: isPartyMode = zone.members.length > 1;
	$: isFullParty = zone.members.length === sonoses.length;
	$: isPlaying = zone.coordinator.state.playbackState === 'PLAYING';
	$: isShuffle = zone.coordinator.state.playMode.shuffle;
	$: isTurntable = zone.coordinator.state.currentTrack.title === 'Turntable';
	$: isTV = zone.coordinator.state.currentTrack.type === 'line_in' && !isTurntable;
</script>

<div class="flex flex-col rounded-lg bg-stone-500 p-3 md:flex-row md:items-center">
	<div class="flex w-full items-center space-x-4 overflow-hidden text-ellipsis md:w-2/5">
		{#if albumArt}
			<img class=" h-12 w-12" src={albumArt} />
		{:else if isTurntable}
			<span class=" w-12 text-center text-4xl ">💽</span>
		{:else if isTV}
			<span class=" w-12 text-center text-4xl ">📺</span>
		{/if}
		<div>
			<div class="text-white">{rooms.join(', ')}</div>
			{#if hasTitleAndAlbum}
				<div class="whitespace-nowrap text-stone-300">
					{zone.coordinator.state.currentTrack.title}
					&#183; {zone.coordinator.state.currentTrack.album}
				</div>
			{:else if zone.coordinator.state.currentTrack.stationName}
				<div class="text-stone-300">{zone.coordinator.state.currentTrack.stationName}</div>
			{/if}
		</div>
	</div>

	<div class="flex flex-1 justify-center text-white">
		<div class="flex items-center space-x-2 text-3xl ">
			<Button on:click={previous}>👈</Button>
			<Button on:click={playpause}>
				{isPlaying ? '⏸' : '🤘'}
			</Button>
			<Button on:click={next}>👉</Button>
		</div>
	</div>

	<div class="flex items-center justify-center space-x-2 text-3xl md:w-2/5 md:justify-end">
		<Button on:click={shuffle} active={isShuffle}>🔀</Button>
		<Button on:click={broadcast} active={isFullParty}>🪩</Button>
		<Button on:click={toggleMute}>🔈</Button>

		<input
			type="range"
			id="volume"
			name="volume"
			class="w-full"
			bind:value={volume}
			on:change={onSetVolume}
			min="0"
			max="100"
		/>
	</div>
</div>
