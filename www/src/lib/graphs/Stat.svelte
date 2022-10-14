<script lang="ts">
	import { onMount, tick } from 'svelte';
	import Chart from '$lib/graphs/Chart.svelte';
	import type { ApexOptions } from 'apexcharts';
	import moment from 'moment';

	export let selectedRooms: string[];
	export let tsStart: number;
	export let tsEnd: number;
	export let roomColors: Record<string, string>;

	export let title: string;
	export let unit: string;
	export let timeSeries: string = 'mqtt_temperature';

	const id = Math.floor(Math.random() * 1000).toString();

	const options: ApexOptions = {
		series: [],
		chart: {
			height: 250,
			zoom: {
				enabled: true
			},
			foreColor: '#292524', // stone-800
			stacked: false,
			toolbar: {
				show: false,
				tools: {
					download: false
				}
			}
			// id: id,
			// group: "synced",
		},

		tooltip: {
			enabled: false,
			// enabledOnSeries: [], // Calculated at runtime
			marker: {
				show: true
			}
		},

		dataLabels: {
			enabled: false
		},

		fill: {
			type: 'solid'
		},

		grid: { show: true, borderColor: '#90A4AE', strokeDashArray: 0, position: 'front' },

		stroke: {
			width: [0, 0, 2]
		},
		title: {
			text: title,
			align: 'center',
			style: {
				fontSize: '14px',
				color: '#57534e'
			}
		},

		legend: {
			show: false
		},

		xaxis: {
			type: 'datetime',
			axisTicks: {
				color: '#e7e5e4' // stone-200
			},
			axisBorder: {
				color: '#e7e5e4' // stone-200
			},
			labels: {
				formatter: function (value: string, timestamp?: number, opts?: any) {
					// fallback for odd inputs
					if (timestamp < 1000) {
						return value;
					}
					const d = moment(timestamp);

					// hovering, show more exact date
					if (opts.i === undefined) {
						return d.format('YYYY-MM-DD HH:mm:ss');
					}

					return d.format('MMM DD'); // "Aug 12"
				}
			}
		},

		yaxis: {
			decimalsInFloat: 2,
			labels: {
				offsetX: -10
			},
			labels: {
				show: true,
				formatter: function (val) {
					return val + unit;
				}
			}
		},

		noData: {
			text: 'Loading...',
			align: 'center',
			verticalAlign: 'middle',
			offsetX: 0,
			offsetY: 0,
			style: {
				color: '#292524',
				fontSize: '24px',
				fontFamily: 'Helvetica'
			}
		},

		annotations: {
			xaxis: []
		}
	};

	let isLoading = false;

	const chartType = async (a: Promise<Array>, type: string) => {
		return a.then((v) => {
			v.map((vv) => {
				vv.type = type;
				return vv;
			});

			return v;
		});
	};

	const nameSuffix = async (a: Promise<Array>, suffix: string) => {
		return a.then((v) => {
			v.map((vv) => {
				vv.name = vv.name + ' ' + suffix;
				return vv;
			});

			return v;
		});
	};

	let loadedOnce = false;

	const ts = async () => {
		const topic = selectedRooms.join('|');

		isLoading = true;
		const [avg, min, max] = await Promise.all([
			chartType(query(`avg_over_time(${timeSeries}{vlg_topic=~"${topic}"}[24h])`), 'line'),

			nameSuffix(
				chartType(query(`min_over_time(${timeSeries}{vlg_topic=~"${topic}"}[24h])`), 'area'),
				'(min)'
			),
			nameSuffix(
				chartType(query(`max_over_time(${timeSeries}{vlg_topic=~"${topic}"}[24h])`), 'area'),
				'(max)'
			)
		]);
		isLoading = false;

		options.series = avg.map((v, idx) => [max[idx], min[idx], avg[idx]]).flatMap((v) => v);
		options.stroke.width = avg.map(() => [0, 0, 2]).flatMap((v) => v);

		// Area fill colors
		options.fill.colors = avg
			.map((v, idx) => [roomColors[v.name], '#d1d5db', roomColors[v.name]])
			.flatMap((v) => v);
		options.fill.opacity = avg.map((v, idx) => [0.4, 1, 1]).flatMap((v) => v);

		// Line colors
		options.colors = avg
			.map((v, idx) => [roomColors[v.name], roomColors[v.name], roomColors[v.name]])
			.flatMap((v) => v);

		// Tooltips
		options.tooltip.enabledOnSeries = avg.map((v, idx) => idx * 3 + 2);
		options = options;

		loadedOnce = true;
	};

	const query = async (
		query: string
	): Promise<Array<ApexAxisChartSeries | ApexNonAxisChartSeries>> => {
		let step = 3600 * 3; // hourly intervals

		const response = await fetch(
			`https://vlg.unicorn-alligator.ts.net/api/v1/query_range?query=${query}&start=${tsStart}&end=${tsEnd}&step=${step}`,
			{
				method: 'GET',
				headers: { Authorization: 'Basic ' + btoa('admin:ZpmTYyMETHPcDmzbyCqQrxKhgKPxgQ') }
			}
		);
		const data = await response.json();

		return data.data.result.map((r: any) => {
			return {
				name: r.metric.vlg_topic,
				data: r.values.map((v: any[]) => {
					return [parseFloat(v[0]) * 1000, parseFloat(v[1]).toPrecision(4)];
				})
			};
		});
	};

	onMount(async () => {
		ts();
	});

	$: selectedRooms, ts();
	$: tsStart, ts();
</script>

{#if loadedOnce}
	<Chart {options} />
{/if}
