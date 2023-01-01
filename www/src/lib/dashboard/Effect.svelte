<script lang="ts">
	export let values: string[];
	export let name: string;
	export let addr: string;
	import { rawSocket } from '$lib/z2m';

	const icons: Record<string, string> = {
		candle: '🕯️',
		fireplace: '🔥',
		colorloop: '🌈',
		sunrise: '☀️',
		stop_hue_effect: '🚫'
	};

	$: effectsWithIcons = values
		.filter((v) => icons[v])
		.map((v) => {
			return {
				name: v,
				icon: icons[v]
			};
		});

	const set = (effect: string) => {
		const payload: Record<string, string> = {};
		payload[name] = effect;

		$rawSocket.send(
			JSON.stringify({
				topic: `${addr}/set`,
				payload
			})
		);
	};
</script>

<div class="font-medium capitalize">
	{name}
</div>
<div class="flex items-center gap-2">
	{#each effectsWithIcons as e}
		<div on:click={() => set(e.name)} class="cursor-pointer">
			{e.icon}
		</div>
	{/each}
</div>
