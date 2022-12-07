<script lang="ts">
	import ColorPicker from 'svelte-awesome-color-picker';
	import Color from 'colorjs.io';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let ws: WebSocket;

	type rgba = { r: number; g: number; b: number; a: number };

	const GRADIENT_LENGTH = 5;

	let rgb1: rgba = { r: 200, g: 1, b: 1, a: 1 };
	let rgb2: rgba = { r: 0, g: 1, b: 1, a: 1 };
	let rgb3: rgba = { r: 1, g: 1, b: 200, a: 1 };

	const rgbToHex = (rgb: rgba): string => {
		return (
			'#' +
			[rgb.r, rgb.g, rgb.b]
				.map((x) => {
					const hex = x.toString(16);
					return hex.length === 1 ? '0' + hex : hex;
				})
				.join('')
		);
	};

	const hexToRGB = (hex: string): rgba => {
		// #fff to #ffffff
		if (hex.length === 4) {
			hex = '#' + hex.slice(1, 2).repeat(2) + hex.slice(2, 3).repeat(2) + hex.slice(3, 4).repeat(2);
		}

		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		return { r, g, b, a: 1 };
	};

	const midLch = (a: rgba, b: rgba): rgba => {
		const lch1 = new Color('sRGB', [a.r / 255, a.g / 255, a.b / 255]);
		const lch2 = new Color('sRGB', [b.r / 255, b.g / 255, b.b / 255]);
		const half = lch1.mix(lch2, 0.5, { space: 'lch', outputSpace: 'srgb' });
		const hex = half.toString({ format: 'hex' });
		return hexToRGB(hex);
	};

	const notBlack = (rgb: rgba): boolean => {
		return rgb.r !== 0 && rgb.g !== 0 && rgb.b !== 0;
	};

	type maybeRGBa = rgba | undefined;
	type gradientFunc = (a: rgba, b: rgba) => rgba;

	const gradient = (rgbs: maybeRGBa[], fn: gradientFunc): string[] => {
		const set = rgbs
			.filter(Boolean)
			.map((r) => r as rgba)
			.filter(notBlack);

		if (set.length === 0) {
			return [];
		}
		if (set.length === 1) {
			return Array(GRADIENT_LENGTH).fill(rgbToHex(set[0]));
		}

		const first = set[0];
		const last = set[set.length - 1];

		let half;
		if (set.length === 2) {
			half = fn(first, last);
		} else {
			half = set[1];
		}

		const firstQ = fn(first, half);
		const thirdQ = fn(last, half);
		return [first, firstQ, half, thirdQ, last].filter(Boolean).map(rgbToHex);
	};

	let sendTimeoutId: NodeJS.Timeout | undefined;

	const send = (colors: string[]) => {
		if (sendTimeoutId) {
			clearTimeout(sendTimeoutId);
		}

		sendTimeoutId = setTimeout(() => {
			const payload = JSON.stringify({
				topic: `Living Room Signe/set`,
				payload: { colors }
			});

			ws.send(payload);
		}, 200);

		return;
	};

	$: lchHexes = gradient([rgb1, rgb2, rgb3], midLch);

	$: lchHexes.length > 0 && send(lchHexes);
</script>

<div class="flex w-full flex-col items-center p-8">
	<div class="w-full">
		<div class="cursor-pointer text-3xl" on:click={() => dispatch('close', {})}>🏠</div>
	</div>

	<div class="w-[20rem]">
		<div>
			<div class="flex">
				{#each lchHexes as hex}
					<div class="h-20 w-20" style="background-color: {hex}" />
				{/each}
			</div>

			<div class="flex justify-around">
				<ColorPicker
					bind:rgb={rgb1}
					isAlpha={false}
					isTextInput={false}
					canChangeMode={false}
					label=""
				/>
				<ColorPicker
					bind:rgb={rgb2}
					isAlpha={false}
					isTextInput={false}
					canChangeMode={false}
					label=""
				/>
				<ColorPicker
					bind:rgb={rgb3}
					isAlpha={false}
					isTextInput={false}
					canChangeMode={false}
					label=""
				/>
			</div>
		</div>
	</div>
</div>
