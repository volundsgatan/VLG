<script lang="ts">
	import { Floorplan } from '$lib/floorplan/index';
	import { Simple } from '$lib/simple/index';
	import NowPlaying from '$lib/music/NowPlaying.svelte';
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

	<div class="z-10 p-2">
		<NowPlaying />
	</div>
</div>
