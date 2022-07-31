<script lang="ts">
	import { type DeviceConfig, groups, type State } from './devices';
	import Temperature from './Temperature.svelte';
	import Sonos from './Sonos.svelte';
	import Light from './Light.svelte';
	import DimmableLight from './DimmableLight.svelte';
	import Occupancy from './Occupancy.svelte';
	import Contact from './Contact.svelte';

	export let states: Record<string, State> = {};
	export let sonos: Record<string, any> = {};
	export let name: string;
	export let joinRoomName: string | null = null; // Join light status with this room
	export let ws: WebSocket;

	const mqttStatesForAddrs = (
		states: Record<string, State>,
		roomDevices: DeviceConfig[]
	): State[] => {
		const configByAddr: Map<string, DeviceConfig> = new Map();
		for (const device of roomDevices) {
			configByAddr.set(device.addr, device);
		}

		return Object.values(states)
			.filter((s) => s.device?.ieeeAddr !== undefined)
			.filter((s) => configByAddr.has(s.device?.ieeeAddr))
			.map((s) => ({
				...s,
				webConfig: configByAddr.get(s.device?.ieeeAddr)
			}));
	};

	$: group = groups?.find((g) => g.name === name);
	$: roomDevices = group.devices || [];
	$: roomMqttStates = mqttStatesForAddrs(states, roomDevices);

	// Get lights from this room, or from the parent room if any
	$: roomLightsMqttStates = mqttStatesForAddrs(
		states,
		groups?.filter((g) => (joinRoomName && g.name === joinRoomName) ||  g.name === name).map(g => g.devices).flat()
	);
	$: lights = roomLightsMqttStates.filter((s) => s.state !== undefined);
	$: anyLightOn = lights.some((s) => s.state == 'ON');
	$: haveLights = lights.length > 0;

	$: roomSonoses = roomDevices.map((d: DeviceConfig) => d.sonosName).filter(Boolean) || [];
	$: roomSonosStates = roomSonoses.map((name) => {
		return {
			name: name,
			state: sonos[name],
			webConfig: roomDevices.find((d) => d.sonosName == name)
		};
	});

	const toggleLights = () => {
		for (const light of lights) {
			ws.send(
				JSON.stringify({
					topic: `${light.device.ieeeAddr}/set`,
					payload: {
						state: anyLightOn ? 'OFF' : 'ON',
						brightness: 100
					}
				})
			);
		}
	};
</script>

<div
	class="grid p-2 h-full w-full select-none"
	on:click={toggleLights}
	class:grid-cols-1={group.size.cols === 1}
	class:grid-cols-2={group.size.cols === 2}
	class:grid-cols-3={group.size.cols === 3}
	class:grid-cols-4={group.size.cols === 4}
	class:grid-cols-5={group.size.cols === 5}
	class:grid-rows-1={group.size.rows === 1}
	class:grid-rows-2={group.size.rows === 2}
	class:grid-rows-3={group.size.rows === 3}
	class:grid-rows-4={group.size.rows === 4}
	class:grid-rows-5={group.size.rows === 5}
	class:cursor-pointer={haveLights}
	class:bg-[#d6d0c1]={haveLights && anyLightOn}
	class:bg-gray-600={haveLights && !anyLightOn}
	class:text-gray-100={haveLights && !anyLightOn}
>
	{#each roomMqttStates as state}
		<div
			class="text-center inline-flex justify-center items-center text-xl md:text-2xl"
			class:col-start-1={state.webConfig.col === 1}
			class:col-start-2={state.webConfig.col === 2}
			class:col-start-3={state.webConfig.col === 3}
			class:col-start-4={state.webConfig.col === 4}
			class:col-start-5={state.webConfig.col === 5}
			class:row-start-1={state.webConfig.row === 1}
			class:row-start-2={state.webConfig.row === 2}
			class:row-start-3={state.webConfig.row === 3}
			class:row-start-4={state.webConfig.row === 4}
			class:row-start-5={state.webConfig.row === 5}
		>
			{#if state?.temperature}
				<Temperature temperature={state.temperature} light={anyLightOn} />
			{:else if state.contact !== undefined}
				<Contact contact={state.contact} type={state.webConfig.contactDeviceType} />
			{:else if state.occupancy !== undefined}
				<Occupancy occupancy={state.occupancy} />
			{:else if state.state !== undefined && state.duration !== undefined}
				<DimmableLight {state} {ws} />
			{:else if state.state !== undefined && state.duration === undefined}
				<Light {state} {ws} />
			{/if}
		</div>
	{/each}

	{#each roomSonosStates as state}
		<div
			class="flex justify-center items-center"
			class:col-start-1={state.webConfig.col === 1}
			class:col-start-2={state.webConfig.col === 2}
			class:col-start-3={state.webConfig.col === 3}
			class:col-start-4={state.webConfig.col === 4}
			class:col-start-5={state.webConfig.col === 5}
			class:row-start-1={state.webConfig.row === 1}
			class:row-start-2={state.webConfig.row === 2}
			class:row-start-3={state.webConfig.row === 3}
			class:row-start-4={state.webConfig.row === 4}
			class:row-start-5={state.webConfig.row === 5}
		>
			<Sonos track={state} />
		</div>
	{/each}
</div>
