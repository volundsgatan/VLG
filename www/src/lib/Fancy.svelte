<script lang="ts">
	import { type State as SonosState, type Zone } from './sonosTypes';
	import { groups, type State } from './devices';
	import NowPlaying from '$lib/music/NowPlaying.svelte';
	import Device from '$lib/device/Device.svelte';
	import Sonos from '$lib/device/Sonos.svelte';
	import MusicPlaylists from '../lib/music/MusicPlaylists.svelte';
	import FancyBrightness from '$lib/FancyBrightness.svelte';

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
			.map((s) => (s.state === 'ON' ? s.brightness : 0));

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
		return `/floorplan_2_${map}.png`;
	};

	const getState = (states, addr: string) => {
		return Object.values(states).find((s) => s.device?.ieeeAddr === addr);
	};

	$: bg = getBg(states);
</script>

<svelte:head>
	<link rel="preload" as="image" href="/floorplan_2_0000.png" />
	<link rel="preload" as="image" href="/floorplan_2_0001.png" />
	<link rel="preload" as="image" href="/floorplan_2_0010.png" />
	<link rel="preload" as="image" href="/floorplan_2_0011.png" />
	<link rel="preload" as="image" href="/floorplan_2_0100.png" />
	<link rel="preload" as="image" href="/floorplan_2_0101.png" />
	<link rel="preload" as="image" href="/floorplan_2_0110.png" />
	<link rel="preload" as="image" href="/floorplan_2_0111.png" />
	<link rel="preload" as="image" href="/floorplan_2_1000.png" />
	<link rel="preload" as="image" href="/floorplan_2_1001.png" />
	<link rel="preload" as="image" href="/floorplan_2_1010.png" />
	<link rel="preload" as="image" href="/floorplan_2_1011.png" />
	<link rel="preload" as="image" href="/floorplan_2_1100.png" />
	<link rel="preload" as="image" href="/floorplan_2_1101.png" />
	<link rel="preload" as="image" href="/floorplan_2_1110.png" />
	<link rel="preload" as="image" href="/floorplan_2_1111.png" />
</svelte:head>

<div class="flex h-full h-[768px] w-[1024px] flex-col justify-between space-y-2 bg-gray-300">
	<div
		style="background-image: url('{bg}')"
		class="-mt-[40px] h-[556px] w-[1024px] bg-[length:1024px_576px] bg-no-repeat text-white transition-all duration-500	"
	>
		<!-- Bedroom -->
		<FancyBrightness
			room={roomAnyLightOn[0]}
			{ws}
			pos="top-[50px]  left-[60px] h-[210px] w-[310px]"
		/>

		<!-- Kitchen -->
		<FancyBrightness
			room={roomAnyLightOn[1]}
			{ws}
			pos="top-[270px] left-[60px] h-[190px] w-[310px]"
		/>

		<!-- Entrance -->
		<FancyBrightness
			room={roomAnyLightOn[2]}
			{ws}
			pos="top-[170px]   left-[380px] h-[150px] w-[220px] "
		/>

		<!-- Living Room -->
		<FancyBrightness
			room={roomAnyLightOn[3]}
			{ws}
			pos=" top-[40px]  left-[630px] h-[220px] w-[320px]"
		/>

		<!-- Frigde -->
		<Device
			class="absolute top-[423px] left-[235px] text-black"
			state={getState(states, '0x00158d0007f82457')}
		/>

		<!-- Bedroom Temperature -->
		<Device
			class="absolute top-[25px] left-[200px] text-black"
			state={getState(states, '0x00158d0007f82461')}
		/>

		<!-- Bathroom Temperature -->
		<Device
				class="absolute top-[22px] left-[500px] text-black"
				state={getState(states, '0x00158d0007f01537')}
		/>

		<!-- Living Room Temperature -->
		<Device
			class="absolute top-[20px] left-[750px] text-black"
			state={getState(states, '0x00158d000802afb1')}
		/>

		<!-- Yard Temperature -->
		<Device
			class="absolute top-[220px] left-[0px] -rotate-90 text-black"
			state={getState(states, '0x00158d0007e66b8a')}
		/>

		<!-- Door Sensor -->
		<Device
			class="absolute top-[465px] left-[350px] text-black"
			state={getState(states, '0x00158d000839a1f9')}
		/>

		<!-- Window Sensor -->
		<Device
			class="absolute top-[150px] left-[953px] text-black"
			state={getState(states, '0x00158d0008399e95')}
		/>

		<div class="absolute top-[148px] left-[884px] text-black">
			<Sonos on:sonosUpdated name="Five" sonos={sonos['Five']} {sonosIsUpdating} />
		</div>
		<div class="absolute top-[210px] left-[650px] text-black">
			<Sonos on:sonosUpdated name="TV" sonos={sonos['TV']} {sonosIsUpdating} />
		</div>
		<div class="absolute top-[245px] left-[242px] text-black">
			<Sonos on:sonosUpdated name="Kitchen" sonos={sonos['Kitchen']} {sonosIsUpdating} />
		</div>

		<div class="absolute top-[330px] left-[650px] w-[300px]">
			<MusicPlaylists on:sonosUpdated />
		</div>
	</div>

	<div class="p-2">
		<NowPlaying zones={sonosZones} on:sonosUpdated />
	</div>
</div>
