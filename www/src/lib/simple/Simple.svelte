<script lang="ts">
	import Brightness from './Brightness.svelte';
	import { groups } from '$lib/devices';
	import { devices as states } from '$lib/z2m';
	import type { room as roomType } from './types';

	const rooms = ['Bedroom', 'Kitchen', 'Entrance', 'Living Room'];

	$: roomAnyLightOn =
		rooms.map((room) => {
			// All devices in a room
			const devices = groups
				.find((g) => g?.name === room)
				.devices.map(({ addr }) => addr)
				.filter(Boolean);

			const deviceSet = new Set(devices);

			const deviceStates: boolean[] = Object.values($states)
				.filter((s) => deviceSet.has(s.device?.ieeeAddr))
				.map((s) => s.state === 'ON');

			const brightness: number[] = Object.values($states)
				.filter((s) => deviceSet.has(s.device?.ieeeAddr))
				.filter((s) => s.brightness !== undefined)
				.map((s): number => (s.state === 'ON' && s.brightness !== undefined ? s.brightness : 0));

			const anyOn = deviceStates.some((s) => s === true);

			return {
				room,
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
</div>
