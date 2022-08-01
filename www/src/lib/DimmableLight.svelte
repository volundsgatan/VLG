<script lang="ts">
	import { type State } from './devices';
	import { Icon, LightBulb } from "svelte-hero-icons";

	export let state: State;
	export let ws: WebSocket;

	const levels = [0, 50, 125, 254];

	const colors = [
		"",
		"text-amber-400 drop-shadow-[0_-4px_4px_rgba(245,158,11,0.5)]",
		"text-amber-400 drop-shadow-[0_-4px_5px_rgba(245,158,11,0.7)]",
		"text-amber-400 drop-shadow-[0_-4px_6px_rgba(245,158,11,1)]",
	]

	const getColor = (s: State) => {
		if (s.state === 'ON') {
			for (const [idx, level] of levels.entries()) {
				if (s.brightness <= level) {
					return colors[idx];
				}
			}
		}

		return colors[0];
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

	$: color = getColor(state);
</script>

{#if state}
	<div on:click|stopPropagation={toggle} class="cursor-pointer h-16 w-16 inline-flex items-center justify-center" >
		<Icon src="{LightBulb}" solid class="{'h-6 w-6 ' + color}" />
	</div>
{/if}
