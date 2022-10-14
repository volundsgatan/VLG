<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { sparkline } from '@fnando/sparkline';
	import Device from './device/Device.svelte';
	import * as Pancake from '@sveltejs/pancake';
	import { stringify } from 'postcss';
	import Chart from '$lib/graphs/Chart.svelte';
	import type { ApexOptions } from 'apexcharts';

	let options: ApexOptions = {
		series: [],
		chart: {
			height: 350,
			zoom: {
				enabled: true
			},
			foreColor: '#292524', // stone-800
			stacked: false
		},

		fill: {
			type: 'solid'
		},
		grid: { show: true, borderColor: '#90A4AE', strokeDashArray: 0, position: 'front' },

		stroke: {
			width: [0, 0, 2]
		},
		title: {
			text: 'Temperature',
			align: 'left',
			style: {
				fontSize: '18px'
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
			}
		},

		yaxis: {
			decimalsInFloat: 2,
			labels: {
				offsetX: -10
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

	let tsStart = 0;
	let tsEnd = 0;

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

	const colors = [
		[
			'#ffedd5', //  orange-100,
			'#fb923c' // orange-400
		],
		[
			// emerald
			'#d1fae5', //  100,
			'#34d399' // 400
		],
		[
			// sky
			'#e0f2fe', //  100,
			'#38bdf8' // 400
		],
		[
			// rose
			'#ffe4e6', //  100,
			'#fb7185' // 400
		],
		[
			// yellow
			'#fef9c3', //  100,
			'#facc15' // 400
		]
	];

	let roomColors = [];

	const ts = async () => {
		const topic = selectedRooms.join('|');

		isLoading = true;
		const [avg, min, max] = await Promise.all([
			chartType(query(`avg_over_time(mqtt_temperature{vlg_topic=~"${topic}"}[24h])`), 'line'),

			nameSuffix(
				chartType(query(`min_over_time(mqtt_temperature{vlg_topic=~"${topic}"}[24h])`), 'area'),
				'(min)'
			),
			nameSuffix(
				chartType(query(`max_over_time(mqtt_temperature{vlg_topic=~"${topic}"}[24h])`), 'area'),
				'(max)'
			)
		]);
		isLoading = false;

		options.series = avg.map((v, idx) => [max[idx], min[idx], avg[idx]]).flatMap((v) => v);
		options.stroke.width = avg.map(() => [0, 0, 2]).flatMap((v) => v);

		// Area fill colors
		options.fill.colors = avg
			.map((v, idx) => [colors[idx][0], '#d1d5db', colors[idx][1]])
			.flatMap((v) => v);
		options.fill.opacity = avg.map((v, idx) => [0.4, 1, 1]).flatMap((v) => v);

		// Line colors
		options.colors = avg
			.map((v, idx) => [colors[idx][1], colors[idx][1], colors[idx][1]])
			.flatMap((v) => v);

		// Room selector button colors
		roomColors = avg
			.map((v, idx) => [v.name, colors[idx][1]])
			.reduce((m, v) => {
				m[v[0]] = v[1];
				return m;
			}, {});

		options = options;
	};

	const query = async (
		query: string
	): Promise<Array<ApexAxisChartSeries | ApexNonAxisChartSeries>> => {
		let step = 60 * 30; // 10 minute intervals

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

	const diff = 60 * 60 * 24 * 30; // 30 days

	const back = () => {
		tsStart -= diff;
		tsEnd -= diff;
		ts();
	};

	const forward = () => {
		tsStart += diff;
		tsEnd += diff;
		ts();
	};

	const reset = () => {
		tsStart = +new Date() / 1000 - 60 * 60 * 24 * 180;
		tsEnd = +new Date() / 1000;
		ts();
	};

	let showChart = false;

	onMount(async () => {
		showChart = true;
		reset();
	});

	/*options.annotations.xaxis = [
        "03 Oct 2022 01:00",
        "19 Sep 2022 01:00",
        "05 Sep 2022 01:00",
        "15 Aug 2022 01:00",
        "25 Jul 2022 01:00",
        "1 Jul 2022 01:00",
    ].map((d) => {
        return {
      x: new Date(d).getTime(),
      borderColor: '#775DD0',
      label: {
        style: {
          color: '#000',
        },
        text: 'Systelbolaget'
      }
    }
    })*/

	const rooms = ['Outdoor', 'Bedroom', 'Living Room', 'Fridge', 'Bathroom'];
	let selectedRooms = ['Outdoor', 'Living Room'];
	// let selectedRooms = ['Fridge'];
	$: selectedRooms, ts();
</script>

<div class="bg-gray-300 p-2">
	<Chart {options} />

	<div class="space-x-4 p-4 text-3xl">
		<span on:click={back}>⏪</span>
		<span on:click={forward}>⏩</span>
		<span on:click={reset}>🔄</span>
	</div>

	<div class="flex gap-4">
		{#each rooms as room}
			<label
				class="whitespace-nowrap rounded-xl bg-gray-200 px-3 py-2 text-stone-800"
				style="background-color: {roomColors[room] || '#e5e7eb'}"
			>
				<input type="checkbox" bind:group={selectedRooms} value={room} />
				{room}
			</label>
		{/each}
	</div>

	<br />
	<br />
	<br />

	<pre class="text-gray-400">
loading: {isLoading}
    </pre>
</div>
