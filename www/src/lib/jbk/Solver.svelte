<script lang="ts">
	import Guide from '$lib/jbk/Guide.svelte';
	import { onMount } from 'svelte';
	import { solve, type Cell as SolverCell } from '$lib/jbk/solver';

	export let guide: {
        cols: number[][],
        rows: number[][]
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

	$: tiny = cols >= 25 || rows >= 25;
	$: widestRowGuide = guide.rows.map((r) => r.length).sort((a, b) => b - a)[0];
	$: rowGuideWidth = widestRowGuide * (tiny ? 16 : 24);

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
            stopAfterIteration = 0
		}

        state = []
        
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

        state = state
	};

	onMount(() => {
		runSolver(1000);
	});

    // $: guide, runSolver(1000)

    function useSolver(node, param) {
        return {
            update(param) {
                runSolver(1000);
                // console.log("useSolver updated????")
            } 
        }
    }

    $: guide, runSolver(1000)

</script>


<div use:useSolver={guide} class="flex flex-col items-center space-y-4">
	<div >
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

	<div>
		<div class="flex justify-center space-x-4">
			<div class="flex flex-col">
				<!-- Column Guides -->
				<div class="flex ">
					<div style="width: {rowGuideWidth}px" />
					{#each state[0] as cell}
						{#if cell.col === 0}
							<div class="h-full w-[2px]" />
						{/if}

						<Guide
							guides={guide.cols[cell.col]}
							isCol={true}
							{rowGuideWidth}
							selected={false}
							{tiny}
						/>

						{#if cell.col % 5 === 4}
							<div class="h-full w-[2px] " />
						{/if}
					{/each}
				</div>

				{#each state as row}
					{@const rowNum = row[0].row}
					{#if rowNum === 0}
						<div class="h-[2px] bg-gray-400" style="margin-left: {rowGuideWidth}px" />
					{/if}

					<div class="flex">
						<!-- Row Guides -->
						<Guide guides={guide.rows[rowNum]} {rowGuideWidth} selected={false} {tiny} />

						{#each row as cell}
							{#if cell.col === 0}
								<div class="h-full w-[2px] bg-gray-400" />
							{/if}

							<div
								class=" inline-flex items-center justify-center border-2"
								class:h-6={!tiny}
								class:w-6={!tiny}
								class:h-4={tiny}
								class:w-4={tiny}
								class:border-yellow-400={cell.hilight}
								class:border-red-400={cell.hilight2}
								class:border-4={cell.hilight || cell.hilight2}
								class:bg-black={cell.state === true}
								class:bg-gray-200={cell.state === undefined}
							>
								{#if cell.state === false}
									<div class="h-1 w-1 rounded-full bg-gray-800" />
								{/if}
							</div>

							{#if cell.col % 5 === 4}
								<div class="h-full w-[2px] bg-gray-400" />
							{/if}
						{/each}
					</div>

					{#if rowNum % 5 === 4}
						<div class="h-[2px] bg-gray-400" style="margin-left: {rowGuideWidth}px" />
					{/if}
				{/each}
			</div>
		</div>
	</div>

</div>