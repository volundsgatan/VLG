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

	const diff = 60 * 60 * 24 * 30; // 30 days

	const back = () => {
		tsStart -= diff;
		tsEnd -= diff;
	};

	const forward = () => {
		tsStart += diff;
		tsEnd += diff;
	};

	const reset = () => {
		tsStart = +new Date() / 1000 - 60 * 60 * 24 * 180;
		tsEnd = +new Date() / 1000;
	};

	onMount(async () => {
		reset();
	});

	const rooms = ['Outdoor', 'Bedroom', 'Living Room', 'Fridge', 'Bathroom'];
	let selectedRooms = ['Outdoor', 'Living Room'];
</script>

<div class="flex h-full flex-col  justify-between bg-gray-300 p-2 ">
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
		timeSeries="mqtt_temperature"
		title="Temperature"
		unit="℃"
	/>

	<Stat
		{selectedRooms}
		{tsStart}
		{tsEnd}
		{roomColors}
		timeSeries="mqtt_humidity"
		title="Humidity"
		unit="%"
	/>
</div>
