<script lang="ts">
	import Guide from '$lib/jbk/Guide.svelte';
	import { onMount } from 'svelte';
	import { solve, type Cell as SolverCell } from '$lib/jbk/solver';
	import Grid from './Grid.svelte';

	export let guide: {
		cols: number[][];
		rows: number[][];
	};

	$: cols = guide?.cols.length;
	$: rows = guide?.rows.length;

	type Cell = {
		row: number;
		col: number;
		state?: boolean;
		hilight: boolean;
		hilight2: boolean;
	};

	let state: Cell[][] = [];

	const makeRow = (row: number): Cell[] => {
		const col: Cell[] = [];
		for (let c = 0; c < cols; c++) {
			col.push({
				row: row,
				col: c,
				state: undefined,
				hilight: false,
				hilight2: false
			});
		}
		return col;
	};

	let maxUsedIterations = 1;
	let stopAfterIteration = 0;

	const changeIteration = (delta: number) => {
		console.log('xx');
		stopAfterIteration = stopAfterIteration + delta;
		runSolver(stopAfterIteration);
	};

	const runSolver = (stopAfter: number) => {
		const res = solve(guide.rows, guide.cols, stopAfter, true);
		const solved = res.cells;

		// LOL magic number
		if (stopAfter === 1000) {
			maxUsedIterations = res.iterations;
			stopAfterIteration = 0;
		}

		state = [];

		for (let row = 0; row < rows; row++) {
			state.push(makeRow(row));
		}

		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < cols; c++) {
				state[r][c].state = solved[r][c].state;
				state[r][c].hilight = solved[r][c].hilight === true;
				state[r][c].hilight2 = solved[r][c].hilight2 === true;
			}
		}

		state = state;
	};

	onMount(() => {
		runSolver(1000);
	});

	$: guide, runSolver(1000);
</script>

<div class="flex flex-col items-center space-y-4">
	<div>
		{#if stopAfterIteration > 0}
			Iteration {stopAfterIteration} / {maxUsedIterations}
			<button
				on:click={() => changeIteration(-1)}
				type="button"
				class="rounded bg-white py-1 px-2 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
			>
				-
			</button>
			<button
				on:click={() => changeIteration(1)}
				type="button"
				class="rounded bg-white py-1 px-2 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
			>
				+
			</button>
			<button
				on:click={() => {
					stopAfterIteration = 0;
					runSolver(1000);
				}}
				type="button"
				class="rounded bg-white py-1 px-2 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
			>
				Full
			</button>
		{:else}
			<button
				on:click={() => changeIteration(1)}
				type="button"
				class="rounded bg-white py-1 px-2 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
			>
				Show step by step
			</button>
		{/if}
	</div>

	<Grid {guide} withState={state} name="solver" id="solver" showGuide={true} />
</div>
