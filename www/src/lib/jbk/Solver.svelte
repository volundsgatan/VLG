<script lang="ts">
	import { onMount, tick } from 'svelte';
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
	let bruteForce = false;

	let isError = false;
	let isSolved = false;
	let totalGuesses = 0;
	let guesses: { row: number; col: number }[];

	const changeIteration = (delta: number) => {
		stopAfterIteration = stopAfterIteration + delta;
		runSolver(stopAfterIteration);
	};

	let solverDuration: number;

	const runSolver = async (stopAfter: number) => {
		running = true;
		const start = Date.now();
		const solver = solve(guide.rows, guide.cols, stopAfter, true, bruteForce);

		while (true) {
			const s = solver.next();
			if (s.done || s.value.stopped) {
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

	const runSolverNow = () => {
		// runSolver(stopAfterIteration);
	};

	let running = true;

	onMount(async () => {
		running = true;
		await tick();
		await runSolver(1000);
		running = false;
	});
</script>

<div class="flex flex-col items-center space-y-4">
	<div>
		{#if running}Running{:else}Stopped{/if}
	</div>
	<div>
		<div class="relative flex items-start">
			<div class="flex h-6 items-center">
				<input
					id="allow-brute-force"
					aria-describedby="comments-description"
					name="allow-brute-force"
					type="checkbox"
					bind:checked={bruteForce}
					on:change={() => runSolverNow()}
					class="h-4 w-4 rounded border-gray-300 text-purple-800 focus:ring-indigo-600 checked:bg-red-200"
				/>
			</div>
			<div class="ml-3 text-sm leading-6">
				<label for="allow-brute-force" class="font-medium">Brute force</label>
			</div>
		</div>
	</div>
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

	<div class="text-gray-500 text-sm">
		Solved in {maxUsedIterations} iterations ({solverDuration} ms)
	</div>

	<pre>
		isSolved={isSolved}
		isError={isError}
		totalGuesses={totalGuesses}
		guesses={JSON.stringify(guesses)}
	</pre>
</div>
