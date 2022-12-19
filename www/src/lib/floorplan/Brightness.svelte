<script lang="ts">
	import { rawSocket } from '$lib/z2m';
	import type { room as roomType } from './types';

	export let room: roomType;
	export let pos = '';

	let touchStartX = 0;
	let startBrightness = 0;
	let brightness = 0;
	let touching = false;

	const avg = (arr: number[]) => arr.reduce((acc, v, i, a) => acc + v / a.length, 0);

	const clamp = (val: number, min: number, max: number) => {
		if (val < min) {
			return min;
		}
		if (val > max) {
			return max;
		}
		return val;
	};

	const toggleLights = () => {
		for (const addr of room.devices) {
			$rawSocket.send(
				JSON.stringify({
					topic: `${addr}/set`,
					payload: {
						state: room.anyOn ? 'OFF' : 'ON',
						brightness: 100
					}
				})
			);
		}
	};

	const setBrightness = (brightness: number) => {
		for (const addr of room.devices) {
			$rawSocket.send(
				JSON.stringify({
					topic: `${addr}/set`,
					payload: {
						state: brightness > 0 ? 'ON' : 'OFF',
						brightness
					}
				})
			);
		}
	};

	const onTouchStart = (e: TouchEvent) => {
		startBrightness = avg(room.brightness);
		touchStartX = e.touches[0].clientX;
	};

	const onTouchMove = (e: TouchEvent) => {
		const end = e.changedTouches[0].clientX;
		const diff = (end - touchStartX) / 2;
		if (Math.abs(diff) > 5) {
			touching = true;
			brightness = parseInt(clamp(startBrightness + diff, 0, 254).toFixed(0));
		} else {
			touching = false;
		}
	};

	const onTouchEnd = (e: TouchEvent) => {
		if (touching) {
			touching = false;
			setBrightness(brightness);
		}
	};
</script>

<div
	on:click={toggleLights}
	on:touchstart={onTouchStart}
	on:touchmove={onTouchMove}
	on:touchend={onTouchEnd}
	class="absolute inline-flex cursor-pointer items-center justify-around text-center text-3xl text-orange-800 {pos}"
>
	{#if touching}
		<div class="w-32 rounded-lg bg-orange-100 p-8 text-center shadow-lg">
			{((brightness / 254) * 100).toFixed()}%
		</div>
	{/if}
	<slot />
</div>
