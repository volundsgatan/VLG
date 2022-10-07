<script lang="ts">
	import Brightness from '$lib/Brightness.svelte';

	export let roomAnyLightOn;
	export let ws;
</script>

<div class="flex flex-col divide-y-2 divide-gray-400">
	<!-- Bedroom -->
	<Brightness room={roomAnyLightOn[0]} {ws}>Bedroom</Brightness>

	<!-- Kitchen -->
	<Brightness room={roomAnyLightOn[1]} {ws}>Kitchen</Brightness>

	<!-- Entrance -->
	<Brightness room={roomAnyLightOn[2]} {ws}>Entrance</Brightness>

	<!-- Living Room -->
	<Brightness room={roomAnyLightOn[3]} {ws}>Living Room</Brightness>
</div>
