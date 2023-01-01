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
	import Enum from './Enum.svelte';
	import Effect from './Effect.svelte';
	export let state: DeviceState;

	$: definition = $bridgeDevices.find((d) => d?.ieee_address === state.device?.ieeeAddr).definition;
	$: deviceBridgeInfo = $bridgeInfo.config.devices[state.device?.ieeeAddr];

	$: name = deviceBridgeInfo?.description ?? state.device?.friendlyName;
	$: addr = state.device.ieeeAddr;

	const colorMode = (s: DeviceState): string | undefined => {
		if (s?.gradient_extras?.color_mode === 'gradient') {
			return 'gradient';
		} else if (s?.color_mode) {
			return s.color_mode;
		} else {
			return undefined;
		}
	};

const ignoredStat = (s: parsedStat): boolean => {
	const ignored = [
		'power_on_behavior',
		'linkquality',
		'requested_brightness_level',
		'requested_brightness_percent',
		'illuminance_above_threshold',
		'color_temp_startup',
		'gradient_scene',
	];
	return !ignored.includes(s.key);
};

	type parsedStat = {
		key: string;
		name: string;
		unit: string;
		property: string;
		value: string;
		active: boolean;
		values: string[];
		presets: string[];
		type: string;
	};

	type expose = {
		name: string;
		property: string;
		unit: string;
		value: string;
		values: string[];
		presets: string[];
		type: string;
		features: expose[];
	};

	$: stats = definition.exposes
		.map((e: expose): parsedStat[] => {
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
					active,
					values: f.values,
					presets: f.presets,
					type: f.type
				};
			});
		})
		.flat()
		.filter((s: parsedStat) => s.value !== null || s.values !== null)
		.filter(ignoredStat);
</script>

<div class="space-y-2 bg-gray-600 p-2">
	<h2 class="text-lg font-bold text-white">{name}</h2>

	<div class="grid grid-cols-2 gap-x-1 gap-y-0.5 text-gray-200">
		{#each stats as stat}
			{#if stat.key == 'color_xy' && stat.property == 'color' && stat.value !== null}
				<ColorXY value={stat.value} active={stat.active} />
			{:else if stat.key == 'color_hs' && stat.property == 'color' && stat.value !== null}
				<ColorHS value={stat.value} active={stat.active} />
			{:else if stat.key == 'color_temp' && stat.value !== null}
				<ColorTemp value={stat.value} active={stat.active} />
			{:else if stat.key == 'gradient' && stat.value !== null}
				<ColorGradient value={stat.value} active={stat.active} />
			{:else if stat.key == 'state' && stat.value !== null}
				<OnOff value={stat.value} {addr} />
			{:else if stat.name === 'effect' && stat.type === 'enum' && stat.values !== null}
				<Effect name={stat.name} values={stat.values} {addr} />
			{:else if stat.type === 'enum' && stat.values !== null}
				<Enum name={stat.name} values={stat.values} value={stat.value}/>
			{:else if typeof stat.value === 'object' && stat.value !== null}
				<MultiStat name={stat.name} value={stat.value} />
			{:else}
				<Stat name={stat.name} value={stat.value} unit={stat.unit} />
			{/if}
		{/each}
	</div>
</div>
