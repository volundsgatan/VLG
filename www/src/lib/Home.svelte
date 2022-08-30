<script lang="ts">
	import { type State } from '$lib/devices';
	import Room from '$lib/Room.svelte';
	import Music from '../lib/music/MusicPlaylists.svelte';
	import NowPlaying from '$lib/music/NowPlaying.svelte';
	import { type Zone, type State as SonosState } from './sonosTypes';

	export let states: Record<string, State> = {};
	export let ws: WebSocket;
	export let sonos: Record<string, SonosState> = {};
	export let sonosIsUpdating = false;
	export let sonosZones: Array<Zone> = [];
</script>

<div class="flex h-full flex-col justify-between space-y-2 p-2">
	<div class="grid w-full flex-1 grid-cols-7 grid-rows-4 text-gray-700">
		<div
			class="col-start-6 col-end-8 row-start-1 row-end-4 flex flex-col space-y-2 border-l-8 border-black transition-all duration-500"
		>
			<Room name="Living Room" on:sonosUpdated {states} {ws} {sonos} {sonosIsUpdating} />
		</div>

		<div class="col-start-4 col-end-6 row-start-2 row-end-4 transition-all duration-500">
			<Room name="Hallway" joinRoomName="Entrance" {states} {ws} bottomLRounded={false} />
		</div>

		<div class="col-start-4 col-end-5 row-start-4 row-end-5 transition-all duration-500">
			<Room name="Entrance" joinRoomName="Hallway" {states} {ws} topRounded={false} />
		</div>

		<div class="col-start-5 col-end-6 row-start-1 row-end-1 flex flex-col border-b-8 border-black ">
			<Room name="Bathroom" {states} {ws} bg="bg-gray-600" />
		</div>

		<div
			class="col-start-2 col-end-4 row-start-1 row-end-3 border-b-8 border-r-8 border-black transition-all duration-500 "
		>
			<Room name="Bedroom" {states} {ws} />
		</div>

		<div
			class="col-start-4 col-end-5 row-start-1 row-end-1 flex flex-col border-r-8 border-b-8 border-black"
		>
			<Room name="Closet" {states} {ws} />
		</div>

		<div
			class="col-start-2 col-end-4 row-start-3 row-end-5 flex flex-col border-r-8 border-black transition-all duration-500"
		>
			<Room name="Kitchen" on:sonosUpdated {states} {ws} {sonos} {sonosIsUpdating} />
		</div>

		<div class="col-start-1 col-end-2 row-start-1 row-end-5 border-r-8 border-black  text-gray-100">
			<Room name="Yard" {states} {ws} bg="bg-lime-700" />
		</div>

		<div class="col-start-5 col-end-8 row-start-4 flex items-center justify-center">
			<Music on:sonosUpdated />
		</div>
	</div>

	<NowPlaying zones={sonosZones} on:sonosUpdated />
</div>
