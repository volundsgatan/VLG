<script lang="ts">
	import { type State } from '$lib/devices';
	import { type State as SonosState, type Zone } from './sonosTypes';
	import { groups, type State } from './devices';
	import NowPlaying from '$lib/music/NowPlaying.svelte';

	export let states: Record<string, State> = {};
	export let ws: WebSocket;
	export let sonos: Record<string, SonosState> = {};
	export let sonosIsUpdating = false;
	export let sonosZones: Array<Zone> = [];

	const rooms = ['Bedroom', 'Kitchen', 'Entrance', 'Living Room'];

	$: roomAnyLightOn = rooms.map((room) => {
		// All devices in a room
		const devices = groups
			.find((g) => g.name === room)
			.devices.map(({ addr }) => addr)
			.filter(Boolean);

		const deviceSet = new Set(devices);

		const deviceStates: boolean[] = Object.values(states)
			.filter((s) => deviceSet.has(s.device?.ieeeAddr))
			.map((s) => s.state === 'ON');

		const anyOn = deviceStates.some((s) => s === true);

		return {
			room,
			devices,
			anyOn
		};
	});

	const getBg = (states: Record<string, State>): string => {
		const map = rooms
			.map((roomName) => roomAnyLightOn.find((r) => r.room === roomName).anyOn)
			.map((on) => (on ? '1' : '0'))
			.join('');
		return `/floorplan_${map}.png`;
	};

	const toggleLights = (roomName: string) => {
		const room = roomAnyLightOn.find((r) => r.room === roomName);

		for (const addr of room.devices) {
			ws.send(
				JSON.stringify({
					topic: `${addr}/set`,
					payload: {
						state: room.anyOn ? 'OFF' : 'ON',
						brightness: 100
					}
				})
			);
		}
	};

	$: bg = getBg(states);
</script>

<div
	style="background-image: url('{bg}')"
	class="h-[576px] w-[1024px] bg-[length:1024px_576px] bg-no-repeat text-white	"
>
	<div
		on:click={() => toggleLights('Bedroom')}
		class="absolute top-[100px]  left-[60px] h-[200px] w-[310px] cursor-pointer"
	/>
	<div
		on:click={() => toggleLights('Kitchen')}
		class="absolute top-[310px]  left-[60px] h-[160px] w-[330px] cursor-pointer"
	/>
	<div
		on:click={() => toggleLights('Entrance')}
		class="absolute top-[230px]   left-[400px] h-[120px] w-[200px] cursor-pointer"
	/>
	<div
		on:click={() => toggleLights('Living Room')}
		class="absolute  top-[100px]  left-[630px] h-[200px] w-[320px] cursor-pointer"
	/>
</div>

<NowPlaying zones={sonosZones} on:sonosUpdated />
