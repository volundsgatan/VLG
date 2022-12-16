<script lang="ts">
	import Brightness from '$lib/Brightness.svelte';
	export let roomAnyLightOn;
</script>

<div class="flex flex-col divide-y-2 divide-gray-400">
	<!-- Bedroom -->
	<Brightness room={roomAnyLightOn[0]}>Bedroom</Brightness>

	<!-- Kitchen -->
	<Brightness room={roomAnyLightOn[1]}>Kitchen</Brightness>

	<!-- Entrance -->
	<Brightness room={roomAnyLightOn[2]}>Entrance</Brightness>

	<!-- Living Room -->
	<Brightness room={roomAnyLightOn[3]}>Living Room</Brightness>
</div>
