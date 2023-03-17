<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import Guide from '$lib/jbk/Guide.svelte';
	import type { _ } from '$env/static/private';
	import Grid from '$lib/jbk/Grid.svelte';

	export let data: PageData;
	let { guide } = data;
</script>

<div class="flex min-h-full flex-col items-center space-y-8 bg-white p-2 text-black">
	<Grid
		{guide}
		name={guide.name}
		id={guide.name}
		mutable={true}
		showInstructions={true}
		showSidebar={true}
		showGuide={true}
	/>

	<div class="text-gray-400">Gjord med 🧠 av GW och EC</div>
</div>
