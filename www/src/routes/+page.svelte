<script lang="ts">
	import Fancy from '$lib/Fancy.svelte';

	import type { State as SonosState, Zone } from '$lib/music/sonos';
	import type { State } from '$lib/devices';

	export let states: Record<string, State> = {};
	export let ws: WebSocket;
	export let sonos: Record<string, SonosState> = {};
	export let sonosIsUpdating = false;
	export let sonosZones: Array<Zone> = [];
</script>

<Fancy {states} {ws} {sonos} {sonosIsUpdating} {sonosZones} />
