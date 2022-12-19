<script lang="ts">
	export let value: number;
	export let active: boolean;

	import { miredToKelvin, colorTemperatureToRGB, rgbToHex } from './colors/xy';

	$: rgb = colorTemperatureToRGB(miredToKelvin(value));
	$: hex = rgbToHex(rgb.r, rgb.g, rgb.b);
</script>

<div class="font-medium capitalize" class:underline={active} class:text-gray-500={!active}>
	Color Temp
</div>
<div class="flex items-center gap-2" class:underline={active} class:text-gray-500={!active}>
	<div class="h-4 w-4" style="background-color: {hex}" />
	<span class="font-medium">{value}</span>
</div>
