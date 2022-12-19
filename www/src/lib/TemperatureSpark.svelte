<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { sparkline } from '@fnando/sparkline';
	import Device from './device/Device.svelte';

	export let name = 'Outdoor';
	let className = '';
	export { className as class };
	export let height = 24;
	export let addr: string;

	let sparks: number[];
	let sparkEl;
	let promState;

	const render = () => {
		if (sparkEl) {
			sparkline(sparkEl, sparks);
		}
	};

	const ts = async () => {
		const now = +new Date() / 1000;
		const start = +new Date() / 1000 - 60 * 60 * 24;
		const query = 'avg_over_time(mqtt_temperature{vlg_topic=%22' + name + '%22}[10m])';

		const response = await fetch(
			`https://vlg.unicorn-alligator.ts.net/api/v1/query_range?query=${query}&start=${start}&end=${now}&step=100`,
			{
				method: 'GET',
				headers: { Authorization: 'Basic ' + btoa('admin:ZpmTYyMETHPcDmzbyCqQrxKhgKPxgQ') }
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
</script>

<div
	class="{className} inline-flex h-[24px] w-[100px] items-center justify-center"
	on:click={onClick}
>
	{#if showSparks}
		<svg
			bind:this={sparkEl}
			width="100"
			{height}
			stroke-width="2"
			style="stroke: #c2410c; fill: rgba(255,237,213,0.3);"
		/>
	{:else}
		<Device {addr} />
	{/if}
</div>
