<script lang="ts">
	export let value: { x: string; y: string };
	export let active: boolean;
	import { xyBriToRgb, rgbToHex } from './colors/xy';

	$: rgb = xyBriToRgb(parseFloat(value.x), parseFloat(value.y), 50);
	$: hex = rgbToHex(rgb.r, rgb.g, rgb.b);
</script>

<div class="font-medium capitalize class:underline={active} class:text-gray-500={!active}">
	Color XY
</div>
<div class="flex items-center gap-2" class:underline={active} class:text-gray-500={!active}>
	<div class="h-4 w-4" style="background-color: {hex}" />
	<span class="font-medium">x={value.x} y={value.y}</span>
</div>
