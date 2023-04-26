<script lang="ts">
	import config from '$lib/config';

	import { onMount, tick } from 'svelte';
	import Forecast from './Forecast.svelte';

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
		in_hours: string;
		name: string;
		code?: string;
	}

	let forecastAirTemperature: Result[];
	let forecastInOneHourSymbol: Result[];

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

	onMount(async () => {
		ts_air_temperature();
		ts_in_one_hour_symbol();

		const interval_ts_air_temperature = setInterval(ts_air_temperature, 1000 * 60);
		const interval_ts_in_one_hour_symbol = setInterval(ts_in_one_hour_symbol, 1000 * 60);

		return () => {
			clearInterval(interval_ts_air_temperature);
			clearInterval(interval_ts_in_one_hour_symbol);
		};
	});

	$: data =
		(forecastAirTemperature &&
			forecastInOneHourSymbol &&
			forecastAirTemperature
				.map((r): Forecast => {
					const inHours = parseInt(r.metric.in_hours);
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
</script>

<div class="absolute top-[550px] z-10 left-[50px] bg-black/20 rounded-md">
	<div class="flex divide-x divide-black/30">
		{#each data as ts}
			<Forecast hour={ts.hour} temp={ts.air_temperature} icon={ts.icon} />
		{/each}
	</div>
</div>
