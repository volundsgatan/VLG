<script lang="ts">
	import config from '$lib/config';

	import { onMount, tick } from 'svelte';
	import Forecast from './Forecast.svelte';

	type Forecast = {
		in_hours: number;
		hour: number;
		air_temperature: string;
	};

	let data: Forecast[] = [];

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
	}

	const ts = async () => {
		const query = encodeURIComponent('yr_forecast_air_temperature{name="stockholm"}');

		const response = await fetch(
			`https://prometheus.${config.hostname}/api/v1/query?query=${query}`,
			{
				method: 'GET'
			}
		);

		const root = (await response.json()) as Root;
		// sparks = data.data.result[0].values.map((v: any[]) => parseFloat(v[1]));
		// render();

		data = root.data.result
			.map((r): Forecast => {
				const inHours = parseInt(r.metric.in_hours);
				const d = new Date();
				const hour = (d.getHours() + inHours) % 24;
				return {
					in_hours: inHours,
					hour: hour,
					air_temperature: r.value[1]
				};
			})
			.sort((a, b) => a.in_hours - b.in_hours)
			.slice(0, 12);
	};

	onMount(async () => {
		ts();

		const interval = setInterval(ts, 1000 * 60);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<div class="absolute top-[550px] z-10 left-[50px] bg-black/20 rounded-md">
	<div class="flex">
		{#each data as ts}
			<Forecast hour={ts.hour} temp={ts.air_temperature} />
		{/each}
	</div>
</div>
