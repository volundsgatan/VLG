<script lang="ts">
	import type { State as DeviceState } from '$lib/devices';
	export let state: DeviceState;
</script>

<div class="bg-gray-600 p-2">
	<h2 class="text-md font-bold text-white">{state.device?.friendlyName}</h2>

	<div class="grid grid-cols-2 text-gray-200">
		{#if state.state !== undefined}
			<div>Power</div>
			<div>{state.state}</div>
		{/if}

		{#if state.brightness !== undefined}
			<div>Brightness</div>
			<div>{state.brightness}</div>
		{/if}

		{#if state.pressure !== undefined}
			<div>Pressure</div>
			<div>{state.pressure}</div>
		{/if}

		{#if state.temperature !== undefined}
			<div>Temperature</div>
			<div>{state.temperature}°C</div>
		{/if}

		{#if state.humidity !== undefined}
			<div>Humidity</div>
			<div>{state.humidity}%</div>
		{/if}

		{#if state.battery !== undefined}
			<div>Battery</div>
			<div>{state.battery}%</div>
		{/if}

		{#if state.voltage !== undefined}
			<div>Voltage</div>
			<div>{state.voltage}V</div>
		{/if}

		{#if state.contact !== undefined}
			<div>Contact</div>
			<div>{state.contact}</div>
		{/if}

		{#if state.occupancy !== undefined}
			<div>Occupied</div>
			<div>{state.occupancy}</div>
		{/if}
	</div>
</div>
