<script lang="ts">
	import type { State as DeviceState } from '$lib/devices';
	import { bridgeDevices, bridgeInfo } from '$lib/z2m';
	import { Stat } from './index';
	import MultiStat from './MultiStat.svelte';
	export let state: DeviceState;

	$: definition = $bridgeDevices.find((d) => d?.ieee_address === state.device?.ieeeAddr).definition;
	$: deviceBridgeInfo = $bridgeInfo.config.devices[state.device?.ieeeAddr];

	$: name = deviceBridgeInfo?.description ?? state.device?.friendlyName;

	$: stats = definition.exposes
		.map((e) => {
			const feats = e.features ?? [e];
			return feats.map((f) => {
				return {
					name: f.name ? f.name.replaceAll('_', ' ') : 'Unknown',
					unit: f.unit,
					property: f.property,
					value: state[f.property] ?? null
				};
			});
		})
		.flat()
		.filter((s) => s.value !== null);
</script>

<div class="space-y-2 bg-gray-600 p-2">
	<h2 class="text-lg font-bold text-white">{name}</h2>

	<div class="grid grid-cols-2 gap-x-1 gap-y-0.5 text-gray-200">
		{#each stats as stat}
			{#if typeof stat.value === 'object'}
				<MultiStat name={stat.name} value={stat.value} />
			{:else}
				<Stat name={stat.name} value={stat.value} unit={stat.unit} />
			{/if}
		{/each}
	</div>

	<pre>{JSON.stringify(definition, null, '  ')}</pre>
</div>
