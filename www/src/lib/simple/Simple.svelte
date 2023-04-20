<script lang="ts">
	import Brightness from './Brightness.svelte';
	import config from '$lib/config';
	import { devices as states } from '$lib/z2m';
	import type { room as roomType } from './types';

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
				room: room.name,
				devices,
				anyOn,
				brightness
			};
		}) || ([] as roomType[]);
</script>

<div class="flex flex-col divide-y-2 divide-gray-400">
	<Brightness room={roomAnyLightOn[0]}>Bedroom</Brightness>

	<Brightness room={roomAnyLightOn[1]}>Kitchen</Brightness>

	<Brightness room={roomAnyLightOn[2]}>Entrance</Brightness>

	<Brightness room={roomAnyLightOn[3]}>Living Room</Brightness>

	<div class="flex justify-around pt-16 text-5xl">
		<a class="cursor-pointer" href="/graphs"> 📊 </a>
		<a class="cursor-pointer" href="/gradient"> 🎨 </a>
		<a class="cursor-pointer" href="/dashboard"> 🎛️ </a>
	</div>
</div>
