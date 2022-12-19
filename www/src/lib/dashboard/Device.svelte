<script lang="ts">
	import type { State as DeviceState } from '$lib/devices';
	import { bridgeDevices, bridgeInfo } from '$lib/z2m';
	import { Stat } from './index';
	import MultiStat from './MultiStat.svelte';
	import ColorXY from './ColorXY.svelte';
	import ColorHS from './ColorHS.svelte';
	import ColorTemp from './ColorTemp.svelte';
	import ColorGradient from './ColorGradient.svelte';
	import OnOff from './OnOff.svelte';
	export let state: DeviceState;

	$: definition = $bridgeDevices.find((d) => d?.ieee_address === state.device?.ieeeAddr).definition;
	$: deviceBridgeInfo = $bridgeInfo.config.devices[state.device?.ieeeAddr];

	$: name = deviceBridgeInfo?.description ?? state.device?.friendlyName;
	$: addr = state.device?.ieeeAddr;

	const colorMode = (s: DeviceState): string | undefined => {
		if (s?.gradient_extras?.color_mode === 'gradient') {
			return 'gradient';
		} else if (s?.color_mode) {
			return s.color_mode;
		} else {
			return undefined;
		}
	};

	$: stats = definition.exposes
		.map((e) => {
			const feats = e.features ?? [e];
			return feats.map((f) => {
				const mode = colorMode(state);
				const active = mode === f.property || `color_${mode}` === f.name;
				return {
					key: f.name,
					name: f.name ? f.name.replaceAll('_', ' ') : 'Unknown',
					unit: f.unit,
					property: f.property,
					value: state[f.property] ?? null,
					active
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
			{#if stat.key == 'color_xy' && stat.property == 'color'}
				<ColorXY value={stat.value} active={stat.active} />
			{:else if stat.key == 'color_hs' && stat.property == 'color'}
				<ColorHS value={stat.value} active={stat.active} />
			{:else if stat.key == 'color_temp'}
				<ColorTemp value={stat.value} active={stat.active} />
			{:else if stat.key == 'gradient'}
				<ColorGradient value={stat.value} active={stat.active} />
			{:else if stat.key == 'state'}
				<OnOff value={stat.value} {addr} />
			{:else if typeof stat.value === 'object'}
				<MultiStat name={stat.name} value={stat.value} />
			{:else}
				<Stat name={stat.name} value={stat.value} unit={stat.unit} />
			{/if}
		{/each}
	</div>
</div>
