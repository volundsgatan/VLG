<script lang="ts">
	import { Floorplan } from '$lib/floorplan/index';
	import { Simple } from '$lib/simple/index';
	import NowPlaying from '$lib/music/NowPlaying.svelte';
	import Weather from '$lib/weather/Weather.svelte';

	let showWeather = true;
	let showNowPlaying = false;

	const setShowWeather = () => {
		showWeather = true;
		showNowPlaying = false;
	};

	const setShowNowPlaying = () => {
		showNowPlaying = true;
		showWeather = false;
	};
</script>

<div
	class="flex h-full w-full select-none flex-col justify-between space-y-2 bg-gray-300"
	style="touch-action: none;"
>
	<div class="md:hidden">
		<Simple />
	</div>

	<div class="mx-auto hidden md:block">
		<Floorplan />
	</div>

	<div class="z-10 space-y-2 absolute bottom-2 left-2 right-16 hidden md:block">
		{#if showWeather}
			<Weather />
		{/if}

		{#if showNowPlaying}
			<NowPlaying />
		{/if}
	</div>

	<div class="absolute z-10 bottom-0 right-2 bottom-2 flex-col space-y-2 hidden md:flex">
		<a class="cursor-pointer text-3xl bg-stone-200 rounded-md p-2" href="/graphs"> 📊 </a>
		<a class="cursor-pointer text-3xl bg-stone-200 rounded-md p-2" href="/gradient"> 🎨 </a>
		<a class="cursor-pointer text-3xl bg-stone-200 rounded-md p-2" href="/dashboard"> 🎛️ </a>
		<a
			class="cursor-pointer text-3xl bg-stone-200 rounded-md p-2"
			class:opacity-50={showNowPlaying}
			href="#"
			on:click|stopPropagation|preventDefault={setShowNowPlaying}>🎶</a
		>
		<a
			class="cursor-pointer text-3xl bg-stone-200 rounded-md p-2"
			class:opacity-50={showWeather}
			href="#"
			on:click|stopPropagation|preventDefault={setShowWeather}>🌤️</a
		>
	</div>
</div>
