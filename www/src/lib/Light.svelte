<script lang="ts">
	import { type State } from './devices';
	import { Icon, LightBulb } from "svelte-hero-icons";
	
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

	$: on = state.state === 'ON'
</script>

{#if state}
	<div on:click|stopPropagation={toggle} class="cursor-pointer">
		{#if on}
			<Icon src="{LightBulb}" solid class="h-6 w-6 text-amber-400 drop-shadow-[0_4px_4px_rgba(245,158,11,0.5)]" />
		{:else}
			<Icon src="{LightBulb}" solid class="h-6 w-6 text-gray-400" /> 
		{/if}
	</div>
{/if}
