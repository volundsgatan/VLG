<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import Stat from '$lib/graphs/Stat.svelte';

	const dispatch = createEventDispatcher();

	let tsStart = 0;
	let tsEnd = 0;

	const roomColors = {
		Outdoor: '#38bdf8', // Sky 400
		Bedroom: '#059669', // Emerald 600
		'Living Room': '#fbbf24', // Amber 400
		Fridge: '#818cf8', // Indigo 400
		Bathroom: '#fb7185' // Rose 400
	};

	let moveDiff = 0;
	let startDiff = 0;
	let period = '1d';
	let step = 60 * 60;

	const back = () => {
		tsStart -= moveDiff;
		tsEnd -= moveDiff;
	};

	const forward = () => {
		tsStart += moveDiff;
		tsEnd += moveDiff;
	};

	const reset = () => {
		tsStart = +new Date() / 1000 - startDiff;
		tsEnd = +new Date() / 1000;
	};

	let isMonthView = true;

	const useDay = () => {
		isMonthView = false;
		period = '1h';
		step = 60 * 5; // 10 minutes
		startDiff = 60 * 60 * 24 * 3; // 3 days
		moveDiff = 60 * 60 * 24; // 1 day
		reset();
	};

	const useMonth = () => {
		isMonthView = true;
		period = '1d';
		step = 60 * 60; // 1 hour
		startDiff = 60 * 60 * 24 * 90; // 3 months
		moveDiff = 60 * 60 * 24 * 30; // 1 month
		reset();
	};

	useMonth();

	const rooms = ['Outdoor', 'Bedroom', 'Living Room', 'Fridge', 'Bathroom'];
	let selectedRooms = ['Outdoor', 'Living Room'];
</script>

<div class="flex h-full flex-col justify-between space-y-2 overflow-hidden bg-gray-300 p-2">
	<div class="rounded-lg bg-stone-500 p-3 px-4">
		<div class="flex items-center justify-between space-x-4">
			<div class="cursor-pointer text-3xl" on:click={() => dispatch('close', {})}>🏠</div>

			<div class="flex space-x-4">
				{#each rooms as room}
					<label
						class="whitespace-nowrap rounded-xl border-2 bg-gray-200 px-3 py-2 text-stone-700"
						class:border-stone-600={selectedRooms.includes(room)}
						class:border-transparent={!selectedRooms.includes(room)}
						style="background-color: {roomColors[room]}"
					>
						<input type="checkbox" class="hidden" bind:group={selectedRooms} value={room} />
						{room}
					</label>
				{/each}
			</div>

			<div class="flex-shrink-0 space-x-4 text-3xl">
				<span
					class="block inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-2xl"
					class:bg-stone-300={!isMonthView}
					on:click={useDay}>☀️</span
				>
				<span
					class="block inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-2xl"
					class:bg-stone-300={isMonthView}
					on:click={useMonth}>🌙</span
				>

				<span on:click={back}>⏪</span>
				<span on:click={forward}>⏩</span>
				<span on:click={reset}>🔄</span>
			</div>
		</div>
	</div>

	<Stat
		{selectedRooms}
		{tsStart}
		{tsEnd}
		{roomColors}
		{period}
		{step}
		timeSeries="mqtt_temperature"
		title="Temperature"
		unit="℃"
	/>

	<Stat
		{selectedRooms}
		{tsStart}
		{tsEnd}
		{roomColors}
		{period}
		{step}
		timeSeries="mqtt_humidity"
		title="Humidity"
		unit="%"
	/>
</div>
