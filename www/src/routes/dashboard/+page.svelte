<script lang="ts">
	import { sortedDevicesList } from '$lib/z2m';
	import Device from '$lib/dashboard/Device.svelte';
	$: namedDevices = $sortedDevicesList.filter((d) => d && d?.device?.friendlyName);
</script>

<div class="text-white">
	<div class="grid grid-cols-3 gap-2 p-2">
		{#each namedDevices as state}
			<Device {state} />
		{/each}
	</div>
</div>
