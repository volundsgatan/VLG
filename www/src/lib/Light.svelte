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
	<div on:click|stopPropagation={toggle} class="cursor-pointer h-16 w-16 inline-flex items-center justify-center">
		{#if on}
			<Icon src="{LightBulb}" solid class="h-12 w-12 text-amber-400 drop-shadow-[0_-4px_6px_rgba(245,158,11,1)]" />
		{:else}
			<Icon src="{LightBulb}" solid class="h-12 w-12 text-stone-400" />
		{/if}
	</div>
{/if}
