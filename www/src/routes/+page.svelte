<script lang="ts">
	import { onMount } from 'svelte';
	import { type State } from '$lib/devices';
	import Room from '$lib/Room.svelte';
	import Music from '../lib/music/Music.svelte';
	import NowPlaying from '$lib/music/NowPlaying.svelte';
	import { type Zone, type State as SonosState } from '$lib/sonosApi';

	let states: Record<string, State> = {};
	let ws: WebSocket;

	let sonos: Record<string, SonosState> = {};
	let sonosIsUpdating = false;
	let sonosZones: Array<Zone> = [];

	const fetchSonos = async () => {
		return fetch('http://vlg-pi.volundsgatan.org.github.beta.tailscale.net:5005/zones')
			.then((res) => res.json())
			.then((zones: Array<Zone>) => {
				sonosZones = zones;
				for (const zone of zones) {
					for (const member of zone.members) {
						sonos[member.roomName] = member.state;
					}
				}
			})
			.catch((err) => {
				console.error(err);
			});
	};

	type m2qevent = {
		topic: string;
		payload?: State | string;
	};

	const onSonosUpdated = async () => {
		console.log('onSonosUpdated');
		sonosIsUpdating = true;
		for (let i = 0; i < 10; i++) {
			await fetchSonos();
			await new Promise((f) => setTimeout(f, 100));
		}
		sonosIsUpdating = false;
	};

	onMount(() => {
		ws = new WebSocket('ws://vlg-pi.volundsgatan.org.github.beta.tailscale.net:8080/api');
		ws.onmessage = (event) => {
			const data: m2qevent = JSON.parse(event.data);
			if (!data.payload) {
				return;
			}
			if (typeof data.payload === 'string') {
				return;
			}

			if (states[data.topic]) {
				states[data.topic] = Object.assign(states[data.topic], data.payload);
			} else {
				states[data.topic] = data.payload;
			}

			states = states;
		};

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

<div class="flex  h-full flex-col justify-between space-y-2 p-2">
	<div class="grid w-full flex-1 grid-cols-7 grid-rows-4 text-gray-700">
		<div
			class="col-start-6 col-end-8 row-start-1 row-end-4 flex flex-col space-y-2 border-l-2 border-black transition-all duration-500"
		>
			<Room
				name="Living Room"
				on:sonosUpdated={onSonosUpdated}
				{states}
				{ws}
				{sonos}
				{sonosIsUpdating}
			/>
		</div>

		<div class="col-start-4 col-end-6 row-start-2 row-end-4 transition-all duration-500">
			<Room name="Hallway" joinRoomName="Entrance" {states} {ws} />
		</div>

		<div class="col-start-4 col-end-5 row-start-4 row-end-5 transition-all duration-500">
			<Room name="Entrance" joinRoomName="Hallway" {states} {ws} />
		</div>

		<div
			class="col-start-5 col-end-6 row-start-1 row-end-1 flex flex-col border-b-2 border-black bg-gray-600"
		>
			<Room name="Bathroom" {states} {ws} />
		</div>

		<div
			class="col-start-2 col-end-4 row-start-1 row-end-3 border-b-2 border-r-2 border-black transition-all duration-500 "
		>
			<Room name="Bedroom" {states} {ws} />
		</div>

		<div
			class="col-start-4 col-end-5 row-start-1 row-end-1 flex flex-col border-r-2 border-b-2 border-black bg-gray-600"
		>
			<Room name="Closet" {states} {ws} />
		</div>

		<div
			class="col-start-2 col-end-4 row-start-3 row-end-5 flex flex-col border-r-2 border-black transition-all duration-500"
		>
			<Room
				name="Kitchen"
				on:sonosUpdated={onSonosUpdated}
				{states}
				{ws}
				{sonos}
				{sonosIsUpdating}
			/>
		</div>

		<div
			class="col-start-1 col-end-2 row-start-1 row-end-5 border-r-2 border-black bg-lime-700 p-2 text-gray-100"
		>
			<Room name="Yard" {states} {ws} />
		</div>

		<div class="col-start-5 col-end-8 row-start-4 flex items-center justify-center">
			<Music on:sonosUpdated={onSonosUpdated} />
		</div>
	</div>

	<NowPlaying zones={sonosZones} on:sonosUpdated={onSonosUpdated} />
</div>
