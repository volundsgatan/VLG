<script lang="ts">
	import { type State } from '../sonosTypes';
	import { createEventDispatcher } from 'svelte';
	import Spinner from '../Spinner.svelte';
	import { sonosRequest } from '../sonos';

	const dispatch = createEventDispatcher();

	export let sonos: State;
	export let name: string;
	export let sonosIsUpdating = false;

	$: isPlaying = sonos?.playbackState === 'PLAYING';

	const toggle = async () => {
		if (isPlaying) {
			return sonosRequest(name + '/leave')
				.then(() => {
					dispatch('sonosUpdated', {});
				})
				.catch((err) => {
					console.error(err);
				});
		} else {
			return sonosRequest(name + '/join/TV')
				.then(() => {
					dispatch('sonosUpdated', {});
				})
				.catch((err) => {
					console.error(err);
				});
		}
	};
</script>

<div
	on:click|stopPropagation={toggle}
	class="inline-flex h-16 w-16 cursor-pointer items-center justify-center"
>
	{#if !isPlaying && sonosIsUpdating}
		<Spinner />
	{:else if isPlaying}
		<div class="relative">
			<span class="flex h-4 w-4 items-center justify-around">
				<span
					class="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-300 opacity-75"
				/>
				<span class="relative inline-flex h-2 w-2 rounded-full bg-orange-400" />
			</span>
		</div>
	{/if}
</div>
