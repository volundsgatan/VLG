<script lang="ts">
	import type { PageData } from './$types';
	import Solver from '$lib/jbk/Solver.svelte';
	export let data: PageData;
	let { guide } = data;
</script>

<div class="flex min-h-full flex-col items-center space-y-4 bg-white p-2 text-black">
	<Solver {guide} allowBruteForce={true} />
</div>
