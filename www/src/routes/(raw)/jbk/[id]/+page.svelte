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
	};

	let state: Cell[][] = [];

	type State = typeof state;

	const makeRow = (row: number): Cell[] => {
		const col: Cell[] = [];
		for (let c = 0; c < cols; c++) {
			col.push({
				row: row,
				col: c
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

<div class="min-h-full bg-white text-black ">
	<div class="flex justify-center p-20">
		<div class="flex flex-col">
			<!-- Column Guides -->
			<div class="flex ">
				<div class="w-40" />
				{#each state[0] as cell}
					{#if cell.col === 0}
						<div class="h-full w-[2px]" />
					{/if}

					<Guide
						valid={validatedCols[cell.col] === true}
						invalid={validatedCols[cell.col] === false}
						guides={guide.cols[cell.col]}
						isCol={true}
					/>

					{#if cell.col % 5 === 4}
						<div class="h-full w-[2px] " />
					{/if}
				{/each}
			</div>

			{#each state as row}
				{@const rowNum = row[0].row}
				{#if rowNum === 0}
					<div class="ml-40 h-[2px] bg-gray-400" />
				{/if}

				<div class="flex">
					<!-- Row Guides -->
					<Guide
						valid={validatedRows[rowNum] === true}
						invalid={validatedRows[rowNum] === false}
						guides={guide.rows[rowNum]}
					/>

					{#each row as cell}
						{#if cell.col === 0}
							<div class="h-full w-[2px] bg-gray-400" />
						{/if}

						<div
							class="h-8 w-8 border-2 text-center text-gray-800"
							class:bg-black={cell.state === true}
							class:border-white={cell.state === undefined && !isSelected(cell, selected)}
							class:bg-gray-200={cell.state === undefined}
							class:border-red-800={isSelected(cell, selected)}
							on:click|stopPropagation|preventDefault={() => clickCell(cell)}
						>
							{#if cell.state === false}
								•
							{/if}
						</div>

						{#if cell.col % 5 === 4}
							<div class="h-full w-[2px] bg-gray-400" />
						{/if}
					{/each}
				</div>

				{#if rowNum % 5 === 4}
					<div class="ml-40 h-[2px] bg-gray-400" />
				{/if}
			{/each}
		</div>
		<div>
			<button class="rounded-md border-2 border-purple-800 bg-purple-200 p-2" on:click={validate}
				>Validate</button
			>
		</div>
	</div>
</div>
