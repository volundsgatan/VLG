<script lang="ts">
	import { keyword } from 'color-convert';
	import { convertSymbolKeyToId, getWeatherSymbolId, type TWeatherSymbolKey } from './yr';

	export let hour: number;
	export let temp: string;
	export let icon: string;

	$: t = parseInt(parseFloat(temp).toFixed(0));
	$: h = hour.toFixed(0).padStart(2, '0');

	const getColor = (temp: number): string => {
		if (temp < 0) {
			return 'text-blue-800';
		}
		if (temp < 5) {
			return 'text-blue-600';
		}
		if (temp < 8) {
			return 'text-blue-800';
		}
		if (temp < 10) {
			return 'text-green-600';
		}
		if (temp < 12) {
			return 'text-green-700';
		}
		if (temp < 15) {
			return 'text-green-800';
		}
		if (temp < 18) {
			return 'text-green-900';
		}
		if (temp < 20) {
			return 'text-orange-500';
		}
		if (temp < 25) {
			return 'text-orange-800';
		}
		return 'text-red-800';
	};

	const key = (icon: string): string => {
		return convertSymbolKeyToId(icon as TWeatherSymbolKey) || 'cloudy';
	};

	$: iconKey = key(icon);
</script>

<div class="py-2 text-center inline-flex flex-col items-center">
	<div class="text-sm text-white">{h}</div>
	<img class="w-6 h-6" src="/yr_icons/{iconKey}.svg" />
	<div class="text-md text-white">{t}°</div>
</div>
