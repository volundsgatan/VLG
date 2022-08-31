<script lang="ts">
	import { type State } from '$lib/devices';
	import { type State as SonosState, type Zone } from './sonosTypes';
	import { groups, type State } from './devices';
	import NowPlaying from '$lib/music/NowPlaying.svelte';
	import Device from '$lib/device/Device.svelte';
	import MusicPlaylists from '../lib/music/MusicPlaylists.svelte';

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


		const brightness: boolean[] = Object.values(states)
				.filter((s) => deviceSet.has(s.device?.ieeeAddr))
				.filter((s) => s.brightness !== undefined)
				.map((s) => s.state === 'ON' ? s.brightness : 0);

		const anyOn = deviceStates.some((s) => s === true);

		return {
			room,
			devices,
			anyOn,
			brightness
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

	const getState = (states, addr: string) => {
		return Object.values(states).find((s) => s.device?.ieeeAddr === addr);
	};

	let touchStartX = 0;
	let brightness = 0;
	let final = false

	const onTouchStart = (e: TouchEvent) => {
		touchStartX = e.touches[0].clientX;
		final = false
	};

	const onTouchMove = (e: TouchEvent) => {
		const end = e.changedTouches[0].clientX;
		brightness = (end - touchStartX) / 3;
	};

	const onTouchEnd = (e: TouchEvent) => {
		final = true
	};

	$: bg = getBg(states);
</script>

<svelte:head>
	<link rel="preload" as="image" href="/floorplan_0000.png" />
	<link rel="preload" as="image" href="/floorplan_0001.png" />
	<link rel="preload" as="image" href="/floorplan_0010.png" />
	<link rel="preload" as="image" href="/floorplan_0011.png" />
	<link rel="preload" as="image" href="/floorplan_0100.png" />
	<link rel="preload" as="image" href="/floorplan_0101.png" />
	<link rel="preload" as="image" href="/floorplan_0110.png" />
	<link rel="preload" as="image" href="/floorplan_0111.png" />
	<link rel="preload" as="image" href="/floorplan_1000.png" />
	<link rel="preload" as="image" href="/floorplan_1001.png" />
	<link rel="preload" as="image" href="/floorplan_1010.png" />
	<link rel="preload" as="image" href="/floorplan_1011.png" />
	<link rel="preload" as="image" href="/floorplan_1100.png" />
	<link rel="preload" as="image" href="/floorplan_1101.png" />
	<link rel="preload" as="image" href="/floorplan_1110.png" />
	<link rel="preload" as="image" href="/floorplan_1111.png" />
</svelte:head>

<div class="flex h-full h-[768px] w-[1024px] flex-col justify-between space-y-2 bg-gray-300">
	<div
		style="background-image: url('{bg}')"
		class="-mt-16 h-[576px] w-[1024px] bg-[length:1024px_576px] bg-no-repeat text-white transition-all duration-500	"
	>
		<div
			on:click={() => toggleLights('Bedroom')}
			on:touchstart={onTouchStart}
			on:touchmove={onTouchMove}
			on:touchend={onTouchEnd}
			class="absolute  top-[50px]  left-[60px] h-[200px] w-[310px] cursor-pointer text-center text-3xl text-red-800"
		>
			<pre>
{brightness.toFixed(0)}
final={final}
{JSON.stringify(roomAnyLightOn[0].brightness)}
</pre>
		</div>
		<div
			on:click={() => toggleLights('Kitchen')}
			class="absolute  top-[260px]  left-[60px] h-[160px] w-[330px] cursor-pointer hover:bg-stone-300"
		/>
		<div
			on:click={() => toggleLights('Entrance')}
			class="absolute  top-[160px]   left-[400px] h-[120px] w-[200px] cursor-pointer"
		/>
		<div
			on:click={() => toggleLights('Living Room')}
			class="absolute   top-[50px]  left-[630px] h-[200px] w-[320px] cursor-pointer"
		/>

		<!-- Frigde -->
		<Device
			class="absolute top-[375px] left-[235px] text-black"
			state={getState(states, '0x00158d0007f82457')}
		/>

		<!-- Bedroom Temperature -->
		<Device
			class="absolute top-[28px] left-[200px] text-black"
			state={getState(states, '0x00158d0007f82461')}
		/>

		<!-- Living Room Temperature -->
		<Device
			class="absolute top-[23px] left-[750px] text-black"
			state={getState(states, '0x00158d000802afb1')}
		/>

		<!-- Bathroom Temperature -->
		<Device
			class="absolute top-[25px] left-[500px] text-black"
			state={getState(states, '0x00158d0007f01537')}
		/>

		<!-- Yard Temperature -->
		<Device
			class="absolute top-[150px] left-[0px] -rotate-90 text-black"
			state={getState(states, '0x00158d0007e66b8a')}
		/>

		<!-- Door Sensor -->
		<Device
			class="absolute top-[410px] left-[350px] text-black"
			state={getState(states, '0x00158d000839a1f9')}
		/>

		<!-- Window Sensor -->
		<Device
			class="absolute top-[140px] left-[950px] text-black"
			state={getState(states, '0x00158d0008399e95')}
		/>

		<div class="absolute top-[340px] left-[520px] w-[400px]">
			<MusicPlaylists on:sonosUpdated />
		</div>
	</div>

	<div class="p-2">
		<NowPlaying zones={sonosZones} on:sonosUpdated />
	</div>
</div>
