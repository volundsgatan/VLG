<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { type State } from '../lib/devices';
	import Room from '../lib/Room.svelte';
	import Music from '../lib/Music.svelte';

	let states: Record<string, State> = {};
	let ws: WebSocket;

	let sonos: Record<string, any> = {};

	const fetchSonos = async () => {
		return fetch('http://vlg-pi.gurrewe94.gmail.com.beta.tailscale.net:5005/zones')
			.then((res) => res.json())
			.then((zones) => {
				for (const zone of zones) {
					for (const member of zone.members) {
						sonos[member.roomName] = zone.coordinator.state;
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

	onMount(() => {
		ws = new WebSocket('ws://vlg-pi.gurrewe94.gmail.com.beta.tailscale.net:8080/api');
		ws.onmessage = (event) => {
			const data: m2qevent = JSON.parse(event.data);
			// console.log(data)

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
		}, 3000);
	});
</script>

<svelte:head>
	<title>VLG 🏠❤️</title>
	<meta name="description" content="VLG" />
</svelte:head>

<div class="flex h-full flex-col justify-center space-y-16 p-2">
	<div class="grid-rows-8 grid w-full grid-cols-7 text-gray-700">
		<div
			class="col-start-6 col-end-8 row-start-1 row-end-4 flex flex-col space-y-2 border-l-2 border-black transition-all duration-500"
		>
			<Room name="Living Room" {states} {ws} {sonos} />
		</div>

		<div class="col-start-4 col-end-6 row-start-2 row-end-4 transition-all duration-500">
			<Room name="Hallway" joinRoomName="Entrance" {states} {ws} />
		</div>

		<div class="col-start-4 col-end-5 row-start-4 row-end-6 transition-all duration-500">
			<Room name="Entrance" joinRoomName="Hallway" {states} {ws} />
		</div>

		<div
			class="col-start-4 col-end-6 row-start-1 row-end-2 flex flex-col border-b-2 border-black bg-gray-600"
		>
			<Room name="Bathroom" {states} {ws} />
		</div>

		<div
			class="col-start-2 col-end-4 row-start-1 row-end-3 border-b-2 border-r-2 border-black transition-all duration-500 "
		>
			<Room name="Bedroom" {states} {ws} />
		</div>

		<div
			class="col-start-2 col-end-4 row-start-3 row-end-6 flex flex-col border-r-2 border-black transition-all duration-500"
		>
			<Room name="Kitchen" {states} {ws} {sonos} />
		</div>

		<div
			class="col-start-1 col-end-2 row-start-1 row-end-6 border-r-2 border-black bg-lime-700 p-2 text-gray-100"
		>
			<Room name="Yard" {states} {ws} />
		</div>
	</div>

	<Music />
</div>
