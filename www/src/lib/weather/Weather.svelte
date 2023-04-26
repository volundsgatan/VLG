<script lang="ts">
	import config from '$lib/config';
	import { onMount } from 'svelte';
	import Forecast from './Forecast.svelte';
	import Sunset from './Sunset.svelte';
	import Sunrise from './Sunrise.svelte';

	type Forecast = {
		in_hours: number;
		hour: number;
		air_temperature: string;
		icon: string;
	};

	interface Root {
		status: string;
		data: Data;
	}

	interface Data {
		resultType: string;
		result: Result[];
	}

	interface Result {
		metric: Metric;
		value: [number, string];
	}

	interface Metric {
		coordinates: string;
		in_hours?: string;
		name: string;
		code?: string;
	}

	let forecastAirTemperature: Result[];
	let forecastInOneHourSymbol: Result[];

	let sunriseSeconds: number;
	let sunsetSeconds: number;

	const ts_air_temperature = async () => {
		const query = encodeURIComponent('yr_forecast_air_temperature{name="stockholm"}');

		const response = await fetch(
			`https://prometheus.${config.hostname}/api/v1/query?query=${query}`,
			{
				method: 'GET'
			}
		);
		const root = (await response.json()) as Root;
		forecastAirTemperature = root.data.result;
	};

	const ts_in_one_hour_symbol = async () => {
		const query = encodeURIComponent('yr_forecast_next_1_hours_symbol{name="stockholm"}');

		const response = await fetch(
			`https://prometheus.${config.hostname}/api/v1/query?query=${query}`,
			{
				method: 'GET'
			}
		);
		const root = (await response.json()) as Root;
		forecastInOneHourSymbol = root.data.result;
	};

	const ts_sunrise = async () => {
		const query = encodeURIComponent('yr_sunrise_sunrise_seconds_after_midnight{name="stockholm"}');
		const response = await fetch(
			`https://prometheus.${config.hostname}/api/v1/query?query=${query}`,
			{ method: 'GET' }
		);
		const root = (await response.json()) as Root;
		sunriseSeconds = parseInt(root.data.result[0].value[1]);
	};

	const ts_sunset = async () => {
		const query = encodeURIComponent('yr_sunrise_sunset_seconds_after_midnight{name="stockholm"}');
		const response = await fetch(
			`https://prometheus.${config.hostname}/api/v1/query?query=${query}`,
			{ method: 'GET' }
		);
		const root = (await response.json()) as Root;
		sunsetSeconds = parseInt(root.data.result[0].value[1]);
	};

	const load = () => {
		ts_air_temperature();
		ts_in_one_hour_symbol();
		ts_sunrise();
		ts_sunset();
	};

	onMount(async () => {
		load();
		const interval = setInterval(load, 1000 * 60);
		return () => {
			clearInterval(interval);
		};
	});

	$: data =
		(forecastAirTemperature &&
			forecastInOneHourSymbol &&
			forecastAirTemperature
				.map((r): Forecast => {
					const inHours = parseInt(r.metric?.in_hours || '0');
					const d = new Date();
					const hour = (d.getHours() + inHours) % 24;
					return {
						in_hours: inHours,
						hour: hour,
						air_temperature: r.value[1],
						icon:
							forecastInOneHourSymbol.find((s) => s.metric.in_hours === r.metric.in_hours)?.metric
								.code || ''
					};
				})
				.sort((a, b) => a.in_hours - b.in_hours)
				.slice(0, 12)) ||
		[];

	const midnightSecondsHour = (sunriseSeconds: number) => {
		const offset = new Date().getTimezoneOffset();
		const d = new Date();
		d.setHours(0, 0, sunriseSeconds);
		const h = d.getHours() - offset / 60;
		return h.toFixed(0).padStart(2, '0');
	};

	const midnightSecondsMinute = (sunriseSeconds: number) => {
		const d = new Date();
		d.setHours(0, 0, sunriseSeconds);
		return d.getMinutes().toFixed(0).padStart(2, '0');
	};

	$: sunriseHour = midnightSecondsHour(sunriseSeconds);
	$: sunriseMinute = midnightSecondsMinute(sunriseSeconds);

	$: sunsetHour = midnightSecondsHour(sunsetSeconds);
	$: sunsetMinute = midnightSecondsMinute(sunsetSeconds);
</script>

<div class="absolute top-[550px] z-10 left-[50px] bg-black/20 rounded-md">
	<div class="flex divide-x divide-black/30">
		{#each data as ts}
			<Forecast hour={ts.hour} temp={ts.air_temperature} icon={ts.icon} />
			{#if ts.hour === parseInt(sunsetHour)}
				<Sunset hour={sunsetHour} minute={sunsetMinute} />
			{/if}
			{#if ts.hour === parseInt(sunriseHour)}
				<Sunrise hour={sunriseHour} minute={sunriseMinute} />
			{/if}
		{/each}
	</div>
</div>
