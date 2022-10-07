<script lang="ts">
	import { type State as SonosState, type Zone } from './sonosTypes';
	import { groups, type State } from './devices';
	import NowPlaying from '$lib/music/NowPlaying.svelte';
	import Device from '$lib/device/Device.svelte';
	import Sonos from '$lib/device/Sonos.svelte';
	import MusicPlaylists from '../lib/music/MusicPlaylists.svelte';
	import FancyBrightness from '$lib/FancyBrightness.svelte';
	import TemperatureSpark from './TemperatureSpark.svelte'

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
		return `/floorplan_2_${map}.png?1`;
	};

	const getState = (states, addr: string) => {
		return Object.values(states).find((s) => s.device?.ieeeAddr === addr);
	};

	$: bg = getBg(states);
</script>

<svelte:head>
	<link rel="preload" as="image" href="/floorplan_2_0000.png?1" />
	<link rel="preload" as="image" href="/floorplan_2_0001.png?1" />
	<link rel="preload" as="image" href="/floorplan_2_0010.png?1" />
	<link rel="preload" as="image" href="/floorplan_2_0011.png?1" />
	<link rel="preload" as="image" href="/floorplan_2_0100.png?1" />
	<link rel="preload" as="image" href="/floorplan_2_0101.png?1" />
	<link rel="preload" as="image" href="/floorplan_2_0110.png?1" />
	<link rel="preload" as="image" href="/floorplan_2_0111.png?1" />
	<link rel="preload" as="image" href="/floorplan_2_1000.png?1" />
	<link rel="preload" as="image" href="/floorplan_2_1001.png?1" />
	<link rel="preload" as="image" href="/floorplan_2_1010.png?1" />
	<link rel="preload" as="image" href="/floorplan_2_1011.png?1" />
	<link rel="preload" as="image" href="/floorplan_2_1100.png?1" />
	<link rel="preload" as="image" href="/floorplan_2_1101.png?1" />
	<link rel="preload" as="image" href="/floorplan_2_1110.png?1" />
	<link rel="preload" as="image" href="/floorplan_2_1111.png?1" />
</svelte:head>

<div class="flex h-full w-full flex-col justify-between space-y-2 bg-gray-300">
	<div class="relative mx-auto -mt-[40px] xl:mt-0 bg-red-200  ">
		<div
			style="background-image: url('{bg}')"
			class=" h-[536px] bg-red-200 w-[1024px] bg-[length:1024px_576px] bg-no-repeat text-white transition-all duration-500	"
		>
			<!-- Bedroom -->
			<FancyBrightness
				room={roomAnyLightOn[0]}
				{ws}
				pos="top-[90px]  left-[60px] h-[210px] w-[310px]"
			/>

			<!-- Kitchen -->
			<FancyBrightness
				room={roomAnyLightOn[1]}
				{ws}
				pos="top-[310px] left-[60px] h-[190px] w-[310px]"
			/>

			<!-- Entrance -->
			<FancyBrightness
				room={roomAnyLightOn[2]}
				{ws}
				pos="top-[210px]   left-[380px] h-[150px] w-[220px] "
			/>

			<!-- Living Room -->
			<FancyBrightness
				room={roomAnyLightOn[3]}
				{ws}
				pos=" top-[80px]  left-[630px] h-[220px] w-[320px]"
			/>

			<!-- Frigde -->
			<TemperatureSpark
				name="Fridge"
				class="absolute top-[463px] left-[210px] text-black"
				state={getState(states, '0x00158d0007f82457')}

			/>

			<!-- Bedroom Temperature -->
			<TemperatureSpark
				name="Bedroom"
				class="absolute top-[62px] left-[180px] text-black"
				state={getState(states, '0x00158d0007f82461')}
			/>

			<!-- Bathroom Temperature -->
			<TemperatureSpark
				name="Bathroom"
				class="absolute top-[60px] left-[470px] text-black"
				state={getState(states, '0x00158d0007f01537')}
			/>

			<!-- Living Room Temperature -->
			<TemperatureSpark
				name="Living Room"
				class="absolute top-[55px] left-[730px] text-black"
				state={getState(states, '0x00158d000802afb1')}
			/>

			<!-- Yard Temperature -->
			<TemperatureSpark
				name="Outdoor"
				class="absolute top-[260px] left-[-30px] z-10 -rotate-90 text-black"
				state={getState(states, '0x00158d0007e66b8a')}
			/>

			<!-- Door Sensor -->
			<Device
				class="absolute top-[505px] left-[350px] text-black"
				state={getState(states, '0x00158d000839a1f9')}
			/>

			<!-- Window Sensor -->
			<Device
				class="absolute top-[190px] left-[953px] text-black"
				state={getState(states, '0x00158d0008399e95')}
			/>

			<div class="absolute top-[188px] left-[884px] text-black">
				<Sonos on:sonosUpdated name="Five" sonos={sonos['Five']} {sonosIsUpdating} />
			</div>
			<div class="absolute top-[250px] left-[650px] text-black">
				<Sonos on:sonosUpdated name="TV" sonos={sonos['TV']} {sonosIsUpdating} />
			</div>
			<div class="absolute top-[295px] left-[242px] text-black">
				<Sonos on:sonosUpdated name="Kitchen" sonos={sonos['Kitchen']} {sonosIsUpdating} />
			</div>

			<div class="absolute top-[350px] left-[650px] w-[300px]">
				<MusicPlaylists on:sonosUpdated />
			</div>
		</div>

		<!-- Bottom -->
		<div class="absolute top-[520px] left-0 h-16 w-[1024px] backdrop-blur" />

		<!-- Left -->
		<div class="absolute top-0 left-0 -ml-[15px] h-[560px] w-[30px] backdrop-blur" />

		<!-- Bottom/Left Angled -->
		<div
			class="absolute top-[430px] left-[50px] h-[180px] w-[60px] rotate-[-58deg] backdrop-blur"
		/>
	</div>

	<div class="z-10 p-2">
		<NowPlaying zones={sonosZones} on:sonosUpdated />
	</div>
</div>
