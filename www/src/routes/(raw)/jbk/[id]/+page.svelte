<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import Guide from '$lib/jbk/Guide.svelte';

	export let data: PageData;

	let { guide } = data;
	let cols = guide?.cols.length;
	let rows = guide?.rows.length;

	type Cell = {
		row: number;
		col: number;
		state?: boolean;

		hilight: boolean;
	};

	let state: Cell[][] = [];

	let widestRowGuide = guide.rows.map((r) => r.length).sort((a, b) => b - a)[0];
	let rowGuideWidth = widestRowGuide * 24;

	type State = typeof state;

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

	for (let row = 0; row < rows; row++) {
		state.push(makeRow(row));
	}

	let selected: number[] = [0, 0];

	const save = () => {
		localStorage.setItem('state-' + guide.id, JSON.stringify({ state }));
	};

	const restore = () => {
		const ls = localStorage.getItem('state-' + guide.id);
		if (ls) {
			const js: { state: State } = JSON.parse(ls);
			if (js) {
				state = js.state;
			}
		}
	};

	const toggleCell = (cell: Cell) => {
		if (cell.state === true) {
			cell.state = false;
		} else if (cell.state === false) {
			cell.state = undefined;
		} else {
			cell.state = true;
		}
		state[cell.row][cell.col] = cell;
		save();
	};

	const setCurrentCell = (val: boolean | undefined) => {
		const cell = currentCell();
		cell.state = val;
		state[cell.row][cell.col] = cell;
		save();
	};

	const setCellHilight = (cell: Cell, hilight: boolean) => {
		cell.hilight = hilight;
		state[cell.row][cell.col] = cell;
		save();
	};

	const isSelected = (cell: Cell, selected: number[]): boolean => {
		return cell.row === selected[0] && cell.col === selected[1];
	};

	const clamp = (min: number, max: number, val: number): number => {
		if (val < min) {
			return min;
		}
		if (val > max) {
			return max;
		}
		return val;
	};

	const currentCell = (): Cell => {
		return state[selected[0]][selected[1]];
	};

	const toggleCurrentCell = () => {
		toggleCell(currentCell());
	};

	const toggleCurrentCellHilight = () => {
		const cell = currentCell();
		setCellHilight(cell, !cell.hilight);
	};

	const clickCell = (cell: Cell) => {
		selected = [cell.row, cell.col];
	};

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

	const moveCursor = (e: KeyboardEvent) => {
		if (e.code === 'Space') {
			toggleCurrentCell();
			e.preventDefault();
			e.stopPropagation();
			return;
		}

		if (e.key === 'Backspace') {
			setCurrentCell(undefined);
			const cell = currentCell();
			setCellHilight(cell, false);
			e.preventDefault();
			e.stopPropagation();
			return;
		}

		if (e.key === 'z') {
			toggleCurrentCellHilight();
			e.preventDefault();
			e.stopPropagation();
			return;
		}

		let dx = 0;
		let dy = 0;

		switch (e.key) {
			case 'ArrowUp':
				dy = -1;
				break;
			case 'ArrowDown':
				dy = 1;
				break;
			case 'ArrowRight':
				dx = 1;
				break;
			case 'ArrowLeft':
				dx = -1;
				break;
			default:
				console.log(e);
				return;
		}

		let y = selected[0] + dy;
		if (y < 0) {
			y = rows - 1;
		} else if (y >= rows) {
			y = 0;
		}

		let x = selected[1] + dx;
		if (x < 0) {
			x = cols - 1;
		} else if (x >= cols) {
			x = 0;
		}

		selected = [y, x];

		e.preventDefault();
		e.stopPropagation();
	};

	onMount(() => {
		restore();
	});
</script>

<svelte:window on:keydown={(e) => moveCursor(e)} />

<div class="flex min-h-full flex-col items-center space-y-4 bg-white p-8 text-black">
	<div class="flex justify-center">
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
						selected={selected[1] === cell.col}
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
						selected={selected[0] === rowNum}
					/>

					{#each row as cell}
						{#if cell.col === 0}
							<div class="h-full w-[2px] bg-gray-400" />
						{/if}

						<div
							class="inline-flex h-6 w-6 items-center justify-center border-2"
							class:bg-yellow-400={cell.hilight && cell.state !== true}
							class:border-yellow-400={cell.hilight && cell.state === true}
							class:bg-black={cell.state === true}
							class:border-white={cell.state === undefined && !isSelected(cell, selected)}
							class:bg-gray-200={cell.state === undefined}
							class:border-red-800={isSelected(cell, selected)}
							on:click|stopPropagation|preventDefault={() => clickCell(cell)}
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
		<div>
			<button class="rounded-md border-2 border-purple-800 bg-purple-200 p-2" on:click={validate}
				>Validate</button
			>
		</div>
	</div>

	<div>
		<div><span class="font-mono">[space]</span> – Toggle cell [yes/no/undefined]</div>
		<div><span class="font-mono">[backspace]</span> – Clear cell</div>
		<div><span class="font-mono">z</span> – Hilight</div>
	</div>
</div>
