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
		return `/floorplan_${map}.png`;
	};

	const getState = (states, addr: string) => {
		return Object.values(states).find((s) => s.device?.ieeeAddr === addr);
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
		class="-mt-16 h-[576px] w-[1004px] bg-[length:1024px_576px] bg-no-repeat text-white transition-all duration-500	"
	>
		<!-- Bedroom -->
		<FancyBrightness
			room={roomAnyLightOn[0]}
			{ws}
			pos="top-[50px]  left-[60px] h-[185px] w-[310px]"
		/>

		<!-- Kitchen -->
		<FancyBrightness
			room={roomAnyLightOn[1]}
			{ws}
			pos="top-[240px] left-[60px] h-[160px] w-[310px]"
		/>

		<!-- Entrance -->
		<FancyBrightness
			room={roomAnyLightOn[2]}
			{ws}
			pos="top-[160px]   left-[380px] h-[130px] w-[220px] "
		/>

		<!-- Living Room -->
		<FancyBrightness
			room={roomAnyLightOn[3]}
			{ws}
			pos=" top-[40px]  left-[630px] h-[190px] w-[320px]"
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

		<div class="absolute top-[170px] left-[885px] text-black">
			<Sonos on:sonosUpdated name="Five" sonos={sonos['Five']} {sonosIsUpdating} />
		</div>
		<div class="absolute top-[170px] left-[650px] text-black">
			<Sonos on:sonosUpdated name="TV" sonos={sonos['TV']} {sonosIsUpdating} />
		</div>

		<div class="absolute top-[240px] left-[222px] text-black">
			<Sonos on:sonosUpdated name="Kitchen" sonos={sonos['Kitchen']} {sonosIsUpdating} />
		</div>

		<div class="absolute top-[340px] left-[520px] w-[400px]">
			<MusicPlaylists on:sonosUpdated />
		</div>
	</div>

	<div class="p-2">
		<NowPlaying zones={sonosZones} on:sonosUpdated />
	</div>
</div>
