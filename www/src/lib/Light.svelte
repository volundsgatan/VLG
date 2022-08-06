<script lang="ts">
	import { type State } from './devices';
	import BulbHigh from './BulbIcon/BulbHigh.svelte';
	import BulbOff from './BulbIcon/BulbOff.svelte';

	export let state: State;
	export let ws: WebSocket;

	const nextBrightness = (s: State): number => {
		return s.state === 'ON' ? 0 : 254;
	};

	const toggle = () => {
		const b = nextBrightness(state);
		ws.send(
			JSON.stringify({
				topic: `${state.device.ieeeAddr}/set`,
				payload: {
					state: b === 0 ? 'OFF' : 'ON',
					brightness: b
				}
			})
		);
	};

	$: on = state.state === 'ON';
</script>

{#if state}
	<div
		on:click|stopPropagation={toggle}
		class="inline-flex h-16 w-16 cursor-pointer items-center justify-center"
	>
		{#if on}
			<div class="h-12 w-12 text-amber-500">
				<BulbHigh />
			</div>
		{:else}
			<div class="h-12 w-12 text-stone-400">
				<BulbOff />
			</div>
		{/if}
	</div>
{/if}
