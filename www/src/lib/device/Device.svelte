<script lang="ts">
	import Contact from './Contact.svelte';
	import Temperature from './Temperature.svelte';
	import Occupancy from './Occupancy.svelte';
	import { sortedDevicesList } from '$lib/z2m';
	import type { FloorplanShowDeviceConfig } from '$lib/config';

	export let device: FloorplanShowDeviceConfig;

	$: state = $sortedDevicesList.find((s) => s.device?.ieeeAddr === device.addr);
</script>

<div class="absolute text-black" style="left: {device.left}px; top: {device.top}px">
	{#if !state}
		???
	{:else if state?.temperature}
		<Temperature temperature={state.temperature} light={true} />
	{:else if state.contact !== undefined}
		<Contact contact={state.contact} />
	{:else if state.occupancy !== undefined}
		<Occupancy occupancy={state.occupancy} />
	{/if}
</div>
