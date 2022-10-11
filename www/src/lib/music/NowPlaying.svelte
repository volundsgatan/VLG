<script lang="ts">
	import type { Zone } from './sonos';
	import Controller from './Controller.svelte';

	export let zones: Array<Zone> = [];

	const showStates = ['PLAYING', 'PAUSED_PLAYBACK'];

	$: showZones = zones.filter((z) => showStates.includes(z.coordinator.state.playbackState));
</script>

<div class="flex-shrink-0 space-y-2">
	{#each showZones as zone}
		<Controller {zone} on:sonosUpdated />
	{/each}
</div>
