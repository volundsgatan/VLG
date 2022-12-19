<script lang="ts">
	let className = '';
	export let addr: string;
	export { className as class };
	import Contact from './Contact.svelte';
	import Temperature from './Temperature.svelte';
	import Occupancy from './Occupancy.svelte';
	import { sortedDevicesList } from '$lib/z2m';

	$: state = $sortedDevicesList.find((s) => s.device?.ieeeAddr === addr);
</script>

<div class={className}>
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
