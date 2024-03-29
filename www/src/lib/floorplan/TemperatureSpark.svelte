<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { sparkline } from '@fnando/sparkline';
	import Device from '$lib/device/Device.svelte';
	import type { TemperatureSparkConfig } from '$lib/config';
	import config from '$lib/config';

	export let spark: TemperatureSparkConfig;

	let sparks: number[];
	let sparkEl: SVGSVGElement | undefined;

	const render = () => {
		if (sparkEl) {
			sparkline(sparkEl, sparks);
		}
	};

	const ts = async () => {
		const now = +new Date() / 1000;
		const start = +new Date() / 1000 - 60 * 60 * 24;
		const query = 'avg_over_time(mqtt_temperature{vlg_topic=%22' + spark.name + '%22}[10m])';

		const response = await fetch(
			`https://prometheus.${config.hostname}/api/v1/query_range?query=${query}&start=${start}&end=${now}&step=100`,
			{
				method: 'GET'
			}
		);

		const data = await response.json();
		sparks = data.data.result[0].values.map((v: any[]) => parseFloat(v[1]));
		render();
	};

	const onClick = async () => {
		if (showSparks) {
			showSparks = false;
		} else {
			showSparks = true;
			await tick();
			render();
		}
	};

	let showSparks = false;
	onMount(async () => {
		ts();

		const interval = setInterval(ts, 1000 * 60);

		return () => {
			clearInterval(interval);
		};
	});

	$: nestedDevice = {
		...spark,
		left: 0,
		top: 0
	};
</script>

<div
	class="absolute inline-flex h-[24px] w-[100px] items-center justify-center"
	style="left: {spark.left}px;
	top: {spark.top}px;
	z-index: {spark.zIndex || 0};
	transform: rotate({spark.rotation || 0}deg)"
	on:click={onClick}
	on:keyup={onClick}
>
	{#if showSparks}
		<svg
			bind:this={sparkEl}
			width="100"
			height="24"
			stroke-width="2"
			style="stroke: #c2410c; fill: rgba(255,237,213,0.3);"
		/>
	{:else}
		<Device device={nestedDevice} />
	{/if}
</div>
