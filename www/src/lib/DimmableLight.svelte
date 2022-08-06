<script lang="ts">
	import { type State } from './devices';
	import BulbHigh from './BulbIcon/BulbHigh.svelte';
	import BulbOff from './BulbIcon/BulbOff.svelte';
	import BulbMedium from './BulbIcon/BulbMedium.svelte';
	import BulbLow from './BulbIcon/BulbLow.svelte';

	export let state: State;
	export let ws: WebSocket;

	const levels = [0, 50, 125, 254];

	const colors = ['text-stone-400', 'text-amber-500', 'text-amber-500', 'text-amber-500'];

	const getIconConfig = (s: State) => {
		if (s.state === 'ON') {
			for (const [idx, level] of levels.entries()) {
				if (s.brightness <= level) {
					return [colors[idx], idx];
				}
			}
		}

		return [colors[0], 0];
	};

	const nextBrightness = (s: State): number => {
		for (const [idx, level] of levels.entries()) {
			if (s.brightness <= level) {
				return levels[(idx + 1) % levels.length];
			}
		}
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

	$: [color, idx] = getIconConfig(state);
</script>

{#if state}
	<div
		on:click|stopPropagation={toggle}
		class="inline-flex h-16 w-16 cursor-pointer items-center justify-center"
	>
		<div class={'h-12 w-12 ' + color}>
			{#if idx === 0}
				<BulbOff />
			{:else if idx === 1}
				<BulbLow />
			{:else if idx === 2}
				<BulbMedium />
			{:else if idx === 3}
				<BulbHigh />
			{/if}
		</div>
	</div>
{/if}
