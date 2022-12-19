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

	$: avgRealBrightness = avg(room.brightness);
</script>

<div
	on:click={toggleLights}
	on:touchstart={onTouchStart}
	on:touchmove={onTouchMove}
	on:touchend={onTouchEnd}
	class="inline-flex cursor-pointer items-center justify-around py-4 px-8 text-center  {pos}"
>
	{#if touching}
		<div class="text-center text-3xl text-orange-800">
			{((brightness / 254) * 100).toFixed()}%
		</div>
	{:else}
		<div class="flex w-full justify-start gap-8 text-3xl">
			<span>
				{#if avgRealBrightness > 0}🌝{:else}🌚{/if}
			</span>
			<div>
				<slot />
			</div>
		</div>
	{/if}
</div>
