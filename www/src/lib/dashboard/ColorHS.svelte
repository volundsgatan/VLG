<script lang="ts">
	export let value: { hue: string; saturation: string };
	export let active: boolean;
	import colorconvert from 'color-convert';
	$: rgb = colorconvert.hsl.hex([parseFloat(value.hue), parseFloat(value.saturation), 50]);
</script>

<div class="font-medium capitalize" class:underline={active} class:text-gray-500={!active}>
	Color HS
</div>
<div class="flex items-center gap-2" class:underline={active} class:text-gray-500={!active}>
	<div class="h-4 w-4" style="background-color: #{rgb}" />
	<span class="font-medium">hue={value.hue} sat={value.saturation}</span>
</div>
