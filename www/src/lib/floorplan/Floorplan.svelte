<script lang="ts">
	import config from '$lib/config';
	import Device from '$lib/device/Device.svelte';
	import Sonos from '$lib/device/Sonos.svelte';
	import MusicPlaylists from '$lib/music/MusicPlaylists.svelte';
	import Brightness from '$lib/floorplan/Brightness.svelte';
	import TemperatureSpark from './TemperatureSpark.svelte';
	import { onMount } from 'svelte';

	import { devices as states } from '$lib/z2m';
	import { sonos, sonosIsUpdating } from '$lib/sonos';
	import type { room as roomType } from './types';
	import type { Group } from '$lib/devices';
	import Weather from '$lib/weather/Weather.svelte';

	onMount(() => {
		const refresh = setTimeout(window.location.reload, 1000 * 60 * 60);
		return () => {
			clearTimeout(refresh);
		};
	});

	const rooms = config.rooms;

	$: roomAnyLightOn =
		rooms.map((room) => {
			const group = config.groups.find((g) => g.name === room.name);

			// All devices in a room
			const devices: string[] =
				group?.devices
					.filter((d) => d.addr)
					.map(({ addr }) => addr)
					.map((a) => a as string) || [];

			const deviceSet = new Set(devices);

			const deviceStates: boolean[] = Object.values($states)
				.filter((s) => s.device?.ieeeAddr && deviceSet.has(s.device.ieeeAddr))
				.map((s) => s.state === 'ON');

			const brightness: number[] = Object.values($states)
				.filter((s) => s.device?.ieeeAddr && deviceSet.has(s.device.ieeeAddr))
				.filter((s) => s.brightness !== undefined)
				.map((s): number => (s.state === 'ON' && s.brightness !== undefined ? s.brightness : 0));

			const anyOn = deviceStates.some((s) => s === true);

			return {
				room,
				devices: devices || [],
				anyOn,
				brightness
			};
		}) || ([] as roomType[]);

	$: bgKey = rooms
		.map((room) => roomAnyLightOn?.find((r) => r.room.name === room.name)?.anyOn)
		.map((on) => (on ? '1' : '0'))
		.join('');

	$: bg = `/floorplan_${bgKey}.png?2`;
</script>

<svelte:head>
	<link rel="preload" as="image" href="/floorplan_0000.png?2" />
	<link rel="preload" as="image" href="/floorplan_0001.png?2" />
	<link rel="preload" as="image" href="/floorplan_0010.png?2" />
	<link rel="preload" as="image" href="/floorplan_0011.png?2" />
	<link rel="preload" as="image" href="/floorplan_0100.png?2" />
	<link rel="preload" as="image" href="/floorplan_0101.png?2" />
	<link rel="preload" as="image" href="/floorplan_0110.png?2" />
	<link rel="preload" as="image" href="/floorplan_0111.png?2" />
	<link rel="preload" as="image" href="/floorplan_1000.png?2" />
	<link rel="preload" as="image" href="/floorplan_1001.png?2" />
	<link rel="preload" as="image" href="/floorplan_1010.png?2" />
	<link rel="preload" as="image" href="/floorplan_1011.png?2" />
	<link rel="preload" as="image" href="/floorplan_1100.png?2" />
	<link rel="preload" as="image" href="/floorplan_1101.png?2" />
	<link rel="preload" as="image" href="/floorplan_1110.png?2" />
	<link rel="preload" as="image" href="/floorplan_1111.png?2" />
</svelte:head>

<div class="relative -mt-12 xl:mt-0">
	<div
		style="background-image: url('{bg}')"
		class="h-[536px] w-[1024px] bg-[length:1024px_576px] bg-no-repeat text-white transition-all duration-500"
	>
		{#each roomAnyLightOn as room}
			<Brightness {room} />
		{/each}

		{#each config.temperatureSparks as spark}
			<TemperatureSpark {spark} />
		{/each}

		{#each config.floorplanDevices as device}
			<Device {device} />
		{/each}

		<div class="absolute top-[188px] left-[884px] text-black">
			<Sonos
				on:sonosUpdated
				name="Five"
				sonos={$sonos['Five']}
				sonosIsUpdating={$sonosIsUpdating}
			/>
		</div>
		<div class="absolute top-[250px] left-[650px] text-black">
			<Sonos on:sonosUpdated name="TV" sonos={$sonos['TV']} sonosIsUpdating={$sonosIsUpdating} />
		</div>
		<div class="absolute top-[295px] left-[242px] text-black">
			<Sonos
				on:sonosUpdated
				name="Kitchen"
				sonos={$sonos['Kitchen']}
				sonosIsUpdating={$sonosIsUpdating}
			/>
		</div>
		<div class="absolute top-[180px] left-[67px] text-black">
			<Sonos
				on:sonosUpdated
				name="Bedroom"
				sonos={$sonos['Bedroom']}
				sonosIsUpdating={$sonosIsUpdating}
			/>
		</div>

		<div class="z-10 absolute top-[330px] left-[640px] w-[380px]">
			<MusicPlaylists on:sonosUpdated />
		</div>
	</div>

	<!-- Bottom -->
	<div class="absolute top-[520px] left-0 h-16 w-[1024px] backdrop-blur" />

	<!-- Left -->
	<div class="absolute top-0 left-0 -ml-[15px] h-[560px] w-[30px] backdrop-blur" />

	<!-- Bottom/Left Angled -->
	<div class="absolute top-[430px] left-[50px] h-[180px] w-[60px] rotate-[-58deg] backdrop-blur" />
</div>
