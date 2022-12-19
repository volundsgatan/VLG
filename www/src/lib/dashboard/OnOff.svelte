<script lang="ts">
	export let value: string;
	export let addr: string;
	import { rawSocket } from '$lib/z2m';

	$: on = value === 'ON';

	const toggle = () => {
		$rawSocket.send(
			JSON.stringify({
				topic: `${addr}/set`,
				payload: {
					state: on ? 'OFF' : 'ON'
				}
			})
		);
	};
</script>

<div class="font-medium capitalize">State</div>
<div class="flex items-center gap-2" class:text-green-400={on}>
	<span
		class="cursor-pointer font-medium capitalize"
		on:click={() => toggle()}
		on:keyup={() => toggle()}
	>
		{value.toLowerCase()}
	</span>
</div>
