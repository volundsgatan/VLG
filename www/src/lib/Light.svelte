<script lang="ts">
	import { type State } from './devices';

	export let state: State;
	export let ws: WebSocket;

	const emoji = (s: State) => {
		return s.state === 'ON' ? '💡' : '🌙';
	};

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

	$: icon = emoji(state);
</script>

{#if state}
	<div on:click|stopPropagation={toggle} class="cursor-pointer">
		{icon}
	</div>
{/if}
