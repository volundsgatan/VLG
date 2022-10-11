<script lang="ts">
	import type { Zone } from './sonos';
	import Controller from './Controller.svelte';

	export let zones: Array<Zone> = [];
</script>

<div class="flex-shrink-0 space-y-2">
	{#each zones as zone}
		<Controller {zone} on:sonosUpdated />
	{/each}
</div>
