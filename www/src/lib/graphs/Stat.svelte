<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { Line } from 'svelte-chartjs';
	import 'chartjs-adapter-date-fns';
	import originalFetch from 'isomorphic-fetch';
	import fetchBuilder from 'fetch-retry-ts';
	import config from '$lib/config';

	const retryOpts = {
		retries: 5,
		retryDelay: (attempt: number, error: Error | null, response: Response | null): number =>
			Math.pow(2, attempt) * 400
	};

	const fetch = fetchBuilder(originalFetch, retryOpts);

	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		LineElement,
		LinearScale,
		PointElement,
		CategoryScale,
		TimeSeriesScale,
		Filler
	} from 'chart.js';

	ChartJS.register(
		Title,
		Tooltip,
		Legend,
		LineElement,
		LinearScale,
		PointElement,
		CategoryScale,
		TimeSeriesScale,
		Filler
	);

	export let selectedRooms: string[];
	export let tsStart: number;
	export let tsEnd: number;
	export let roomColors: Record<string, string>;

	export let period: string; // 30m, 2d, etc
	export let step: number; // seconds per data point
	export let timeSeries: string = 'mqtt_temperature';

	let options = {
		scales: {
			x: {
				type: 'timeseries',
				time: {
					displayFormats: {
						quarter: 'MMM YYYY'
					}
				}
			}
		},
		plugins: {
			legend: {
				display: false
			}
		},
		responsive: false
	};

	type XY = {
		x: number;
		y: number;
	};

	type Series = {
		name: string;
		data: XY[];
	};

	type Dataset = {
		label: string;
		data: XY[];

		lineTension?: number;
		backgroundColor?: string;
		borderColor?: string;
		pointRadius?: number;
		pointHitRadius?: number;
		showLine?: boolean;
		fill?: {
			target: string;
		};
	};

	let data: {
		datasets: Dataset[];
	} = {
		datasets: [] // loaded later
	};

	let isLoading = false;

	const hexrgba = (hex: string, a: number): string => {
		const hexes = hex.substring(1).match(/.{1,2}/g);
		if (!hexes || hexes?.length !== 3) {
			return 'rgba(0,0,0,1)';
		}
		const rgba = [parseInt(hexes[0], 16), parseInt(hexes[1], 16), parseInt(hexes[2], 16), a];
		return `rgba(${rgba.join(',')})`;
	};

	let loadedOnce = false;

	let tsTimer: ReturnType<typeof setTimeout>;

	const ts = async () => {
		const topic = selectedRooms.join('|');

		isLoading = true;

		clearTimeout(tsTimer);
		tsTimer = setTimeout(async () => {
			const [avg, min, max] = await Promise.all([
				query(`avg_over_time(${timeSeries}{vlg_topic=~"${topic}"}[${period}])`),
				query(`min_over_time(${timeSeries}{vlg_topic=~"${topic}"}[${period}])`),
				query(`max_over_time(${timeSeries}{vlg_topic=~"${topic}"}[${period}])`)
			]);
			isLoading = false;

			const ds = avg
				.map((v, idx): Dataset[] => {
					return [
						{
							label: `AVG: ${timeSeries} / ${v.name}`,
							lineTension: 0.1,
							backgroundColor: hexrgba(roomColors[v.name], 1),
							borderColor: hexrgba(roomColors[v.name], 1),
							pointRadius: 0,
							pointHitRadius: 1,
							data: v.data
						},
						{
							label: `MAX: ${timeSeries} / ${v.name}`,
							data: max[idx].data,
							pointRadius: 0,
							lineTension: 0.1,
							showLine: false
						},
						{
							label: `MIN: ${timeSeries} / ${v.name}`,
							lineTension: 0.1,
							data: min[idx].data,
							backgroundColor: hexrgba(roomColors[v.name], 0.3),
							fill: {
								target: '-1'
							},
							pointRadius: 0,
							showLine: false
						}
					];
				})
				.flatMap((v) => v);

			if (ds) {
				data.datasets = ds;
				loadedOnce = true;
			}
		}, 500);
	};

	const query = async (query: string): Promise<Array<Series>> => {
		const response = await fetch(
			`https://prometheus.${config.hostname}/api/v1/query_range?query=${query}&start=${tsStart}&end=${tsEnd}&step=${step}`
		);
		const data = await response.json();

		return data.data.result.map((r: any) => {
			return {
				name: r.metric.vlg_topic,
				data: r.values.map((v: any[]) => {
					return {
						x: parseFloat(v[0]) * 1000,
						y: parseFloat(v[1]).toPrecision(4)
					};
				})
			};
		});
	};

	let height = 100;
	let width = 100;
	let wrapper: HTMLElement;
	let readyToRender = false;

	onMount(async () => {
		ts();
		await tick();
		height = wrapper.offsetHeight;
		width = wrapper.offsetWidth;
		readyToRender = true;
	});

	let resizeTimer: ReturnType<typeof setTimeout>;

	const dispatchResize = async () => {
		readyToRender = false;

		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(() => {
			tick().then(() => {
				height = wrapper.offsetHeight;
				width = wrapper.offsetWidth;
				readyToRender = true;
			});
		}, 500);
	};

	$: selectedRooms, ts();
	$: tsStart, ts();
	$: period, ts();
</script>

<svelte:window on:resize={dispatchResize} />

<div class="relative flex-1 rounded-md" bind:this={wrapper} class:bg-stone-200={isLoading}>
	<div class="relative">
		{#if loadedOnce && readyToRender}
			<Line {data} {options} {height} {width} />
		{/if}
	</div>

	{#if isLoading}
		<div class="absolute top-0 left-0 right-0 bottom-0 rounded-md bg-black opacity-50" />
	{/if}
</div>
