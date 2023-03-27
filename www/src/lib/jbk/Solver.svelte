<script lang="ts">
	import Guide from '$lib/jbk/Guide.svelte';
	import { onMount, tick } from 'svelte';
	import { solve, type Cell as SolverCell } from '$lib/jbk/solver';
	import Grid from './Grid.svelte';

	export let guide: {
		cols: number[][];
		rows: number[][];
	};

	export let allowBruteForce: boolean = false;

	$: cols = guide?.cols.length;
	$: rows = guide?.rows.length;

	type Cell = {
		row: number;
		col: number;
		state?: boolean;
		hilight: boolean;
		hilightRed?: boolean;
		hilightGreen?: boolean;
	};

	let state: Cell[][] = [];

	const makeRow = (row: number): Cell[] => {
		const col: Cell[] = [];
		for (let c = 0; c < cols; c++) {
			col.push({
				row: row,
				col: c,
				state: undefined,
				hilight: false
			});
		}
		return col;
	};

	let maxUsedIterations = 1;
	let stopAfterIteration = 0;

	let isError = false;
	let isSolved = false;
	let totalGuesses = 0;
	let guesses: { row: number; col: number }[];

	const changeIteration = (delta: number) => {
		console.log('xx');
		stopAfterIteration = stopAfterIteration + delta;
		runSolver(stopAfterIteration);
	};

	let solverDuration: number;

	const runSolver = async (stopAfter: number) => {
		running = true;
		const start = Date.now();
		const hilightChanges = false;
		const solver = solve(guide.rows, guide.cols, stopAfter, hilightChanges, allowBruteForce);

		while (true) {
			// await tick();
			const s = solver.next();
			if (s.done) {
				const end = Date.now();
				solverDuration = end - start;
				break;
			}
			const res = s.value;

			const solved = res.cells;

			isSolved = !!res.isSolved;
			isError = !!res.isError;
			totalGuesses = res.totalGuesses || 0;
			guesses = res.guesses;

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
					state[r][c].hilightGreen = solved[r][c].hilightGreen === true;
					state[r][c].hilightRed = solved[r][c].hilightRed === true;
				}
			}

			for (const g of guesses) {
				state[g.row][g.col].hilightGreen = true;
			}

			state = state;

			await new Promise((f) => setTimeout(f, 0));
		}
	};

	let running = true;

	onMount(async () => {
		running = true;
		await tick();
		await runSolver(1000);
		running = false;
	});

	$: guide, runSolver(1000);
</script>

<div class="flex flex-col items-center space-y-4">
	<div>running={running}</div>

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

	<Grid {guide} withState={state} name="solver" id="solver" showGuide={true} mutable={false} />

	{#if running}
		<div class="text-gray-500 text-sm">Running... ({totalGuesses} guesses)</div>
	{:else}
		<div class="text-gray-500 text-sm">
			{#if isSolved}
				Solved in {maxUsedIterations} iterations
			{:else if isError}
				Error after {maxUsedIterations} iterations. This is a bug in the solver!
			{:else}
				Stuck after {maxUsedIterations} iterations, this puzzle might not have a solution.
			{/if}
			({solverDuration} ms).
		</div>
	{/if}
</div>
