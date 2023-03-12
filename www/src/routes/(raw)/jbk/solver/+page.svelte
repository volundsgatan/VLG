<script lang="ts">
	import type { PageData } from './$types';
	import Guide from '$lib/jbk/Guide.svelte';
	import { onMount } from 'svelte';
	import { solve, type Cell as SolverCell } from '$lib/jbk/solver';

	export let data: PageData;

	let { guide } = data;
	let cols = guide?.cols.length;
	let rows = guide?.rows.length;

	type Cell = {
		row: number;
		col: number;
		state?: boolean;
		hilight: boolean;
		hilight2: boolean;
	};

	let state: Cell[][] = [];

	let tiny = cols >= 25 || rows >= 25;
	let widestRowGuide = guide.rows.map((r) => r.length).sort((a, b) => b - a)[0];
	let rowGuideWidth = widestRowGuide * (tiny ? 16 : 24);

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

	for (let row = 0; row < rows; row++) {
		state.push(makeRow(row));
	}

	const validate = () => {
		// validate rows
		validatedRows = state.map((row, idx) => validateRow(guide.rows[idx], row));

		// rotate
		const asCols: Cell[][] = [];
		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < cols; c++) {
				if (asCols[c] === undefined) {
					asCols.push([]);
				}
				asCols[c].push(state[r][c]);
			}
		}

		validatedCols = asCols.map((col, idx) => validateRow(guide.cols[idx], col));
	};

	let validatedRows: boolean[] = [];
	let validatedCols: boolean[] = [];

	const validateRow = (guide: number[], cells: Cell[]): boolean => {
		let current = 0;
		const groups = [];

		for (let cell of cells) {
			if (cell.state === true) {
				current++;
			} else if (cell.state === false || cell.state == undefined) {
				if (current > 0) {
					groups.push(current);
				}
				current = 0;
			}
		}
		// last
		if (current > 0) {
			groups.push(current);
		}

		// compare guide with groups
		if (guide.length !== groups.length) {
			return false;
		}

		for (let i = 0; i < guide.length; i++) {
			if (guide[i] !== groups[i]) {
				return false;
			}
		}

		return true;
	};

	let solved: SolverCell[][] = [];

	onMount(() => {
		solved = solve(guide.rows, guide.cols);

		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < cols; c++) {
				state[r][c].state = solved[r][c].state;
				state[r][c].hilight = solved[r][c].hilight === true;
				state[r][c].hilight2 = solved[r][c].hilight2 === true;
			}
		}
	});
</script>

<div class="flex min-h-full flex-col items-center space-y-4 bg-white p-2 text-black">
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
							valid={validatedCols[cell.col] === true}
							invalid={validatedCols[cell.col] === false}
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
						<Guide
							valid={validatedRows[rowNum] === true}
							invalid={validatedRows[rowNum] === false}
							guides={guide.rows[rowNum]}
							{rowGuideWidth}
							selected={false}
							{tiny}
						/>

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
