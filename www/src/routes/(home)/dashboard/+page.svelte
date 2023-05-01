<script lang="ts">
	import { sortedDevicesList } from '$lib/z2m';
	import Device from '$lib/dashboard/Device.svelte';

	$: namedDevices = $sortedDevicesList
		.filter((d) => d && d?.device?.friendlyName)
		.filter((d) => d?.device?.friendlyName.indexOf('Switch') === -1);
</script>

<div class="space-y-4 p-4 text-white">
	<a class="cursor-pointer text-3xl" href="/app">🏠</a>
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
		{#each namedDevices as state}
			<Device {state} />
		{/each}
	</div>
</div>
