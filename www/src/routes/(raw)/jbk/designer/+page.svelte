<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import Guide from '$lib/jbk/Guide.svelte';
	import type { _ } from '$env/static/private';
	import Solver from '$lib/jbk/Solver.svelte';
	import Grid from '$lib/jbk/Grid.svelte';

	let cols = 20;
	let rows = 20;

	type Cell = {
		row: number;
		col: number;
		state?: boolean;

		hilight: boolean;
	};

	let state: Cell[][] = [];

	let tiny = cols >= 25 || rows >= 25;
	let widestRowGuide = 0;
	let widestColGuide = 0;
	let rowGuideWidth = widestRowGuide * (tiny ? 16 : 24);
	let colsGuideWidth = widestColGuide * (tiny ? 16 : 24);

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

	type Position = [number, number];

	let cursor: Position = [-1, -1];
	let selected: Position[] = [];

	const save = () => {
		localStorage.setItem('state-designer', JSON.stringify({ state }));
		makeGuide();
	};

	const restore = () => {
		const ls = localStorage.getItem('state-designer');
		if (ls) {
			const js: { state: State } = JSON.parse(ls);
			if (js) {
				state = js.state;
			}
		}
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

	const above = (p: Position): Position => {
		return [p[0] - 1, p[1]];
	};

	const below = (p: Position): Position => {
		return [p[0] + 1, p[1]];
	};

	const left = (p: Position): Position => {
		return [p[0], p[1] - 1];
	};

	const right = (p: Position): Position => {
		return [p[0], p[1] + 1];
	};

	const isCursorAt = (cell: Cell, cursor: Position): boolean => {
		return cell.row === cursor[0] && cell.col === cursor[1];
	};

	const isCellSelected = (cell: Cell, selected: Position[]): boolean => {
		return isPositionSelected([cell.row, cell.col], selected);
	};

	const isPositionSelected = (p: Position, selected: Position[]): boolean => {
		return !!selected.find((s) => s[0] === p[0] && s[1] === p[1]);
	};

	const isAboveSelected = (cell: Cell, selected: Position[]): boolean => {
		return isPositionSelected(above([cell.row, cell.col]), selected);
	};

	const isBelowSelected = (cell: Cell, selected: Position[]): boolean => {
		return isPositionSelected(below([cell.row, cell.col]), selected);
	};

	const isLeftSelected = (cell: Cell, selected: Position[]): boolean => {
		return isPositionSelected(left([cell.row, cell.col]), selected);
	};

	const isRightSelected = (cell: Cell, selected: Position[]): boolean => {
		return isPositionSelected(right([cell.row, cell.col]), selected);
	};

	const currentCell = (): Cell => {
		return state[cursor[0]][cursor[1]];
	};

	const toggleCurrentCell = () => {
		const c = currentCell();
		let nextState;
		if (c.state === true) {
			nextState = false;
		} else if (c.state === false) {
			nextState = undefined;
		} else {
			nextState = true;
		}

		// set all selected to nextState
		for (const p of selected) {
			state[p[0]][p[1]].state = nextState;
		}

		save();
	};

	const toggleCurrentCellHilight = () => {
		const cell = currentCell();
		setCellHilight(cell, !cell.hilight);
	};

	const clickCell = (cell: Cell) => {
		cursor = [cell.row, cell.col];
		selected = [cursor];
	};

	const clearHighlights = () => {
		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < cols; c++) {
				state[r][c].hilight = false;
			}
		}
		save();
	};

	const clearAll = () => {
		if (!confirm('Are you sure? This will delete all progress!')) {
			return;
		}

		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < cols; c++) {
				state[r][c].state = undefined;
				state[r][c].hilight = false;
			}
		}

		save();
	};

	const cellClasses = (cell: Cell, selected: Position[]): string => {
		let res = [];

		if (isCellSelected(cell, selected) && !isAboveSelected(cell, selected)) {
			res.push('border-t-blue-400/80');
			res.push('border-t-[4px]');
		} else {
			res.push('pt-[4px]');
		}

		if (isCellSelected(cell, selected) && !isBelowSelected(cell, selected)) {
			res.push('border-b-blue-400/80');
			res.push('border-b-[4px]');
		} else {
			res.push('pb-[4px]');
		}

		if (isCellSelected(cell, selected) && !isLeftSelected(cell, selected)) {
			res.push('border-l-blue-400/80');
			res.push('border-l-[4px]');
		} else {
			res.push('pl-[4px]');
		}

		if (isCellSelected(cell, selected) && !isRightSelected(cell, selected)) {
			res.push('border-r-blue-400/80');
			res.push('border-r-[4px]');
		} else {
			res.push('pr-[4px]');
		}

		return res.join(' ');
	};

	const onMouseEnterCell = (e: MouseEvent, cell: Cell) => {
		if (e.buttons === 1) {
			cursor = [cell.row, cell.col];
			selected.push(cursor);
			selected = selected;
		}
	};

	const onWindowKeyDown = (e: KeyboardEvent) => {
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

		// Move cursor
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
				return;
		}

		let y = cursor[0] + dy;
		if (y < 0) {
			y = rows - 1;
		} else if (y >= rows) {
			y = 0;
		}

		let x = cursor[1] + dx;
		if (x < 0) {
			x = cols - 1;
		} else if (x >= cols) {
			x = 0;
		}

		cursor = [y, x];

		// add to selection
		if (e.shiftKey) {
			selected.push(cursor);
			selected = selected;
		} else {
			// reset selection
			selected = [cursor];
		}

		e.preventDefault();
		e.stopPropagation();
	};

	let exportAsInput = '';

	const findGroupsLen = (cells: Cell[]): number[] => {
		const res: number[] = [];

		let start = -1;
		for (const [idx, c] of cells.entries()) {
			if (c.state === true && start === -1) {
				start = idx;
			}
			if (c.state !== true && start > -1) {
				res.push(idx - start);
				start = -1;
			}
		}
		if (start > -1) {
			res.push(cells.length - start);
		}

		return res;
	};

	const onExport = () => {
		const d = makeGuide();

		exportAsInput = JSON.stringify(
			{
				name: 'exported',
				id: 'exported',
				rows: d.rows,
				cols: d.cols
			},
			2,
			4
		);
	};

	type Guide = {
		rows: number[][];
		cols: number[][];
	};

	let guideFromDesign: Guide = {
		rows: [[0]],
		cols: [[0]]
	};

	const makeGuide = (): Guide => {
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

		const d = {
			rows: state.map((r) => findGroupsLen(r)).map((l) => (l.length === 0 ? [0] : l)),
			cols: asCols.map((r) => findGroupsLen(r)).map((l) => (l.length === 0 ? [0] : l))
		};

		guideFromDesign = d;

		return d;
	};

	onMount(() => {
		restore();
		makeGuide();
	});
</script>

<svelte:window on:keydown={(e) => onWindowKeyDown(e)} />

<div class="flex min-h-full flex-col items-center space-y-4 bg-white p-2 text-black">
	<div class="flex items-end w-full">
		<div>
			<div class="flex justify-center space-x-4">
				<div class="flex flex-col">
					{#each state as row}
						{@const rowNum = row[0].row}
						{#if rowNum === 0}
							<div class="h-[2px] bg-gray-400" />
						{/if}

						<div class="flex">
							{#each row as cell}
								{#if cell.col === 0}
									<div class="h-full w-[2px] bg-gray-400" />
								{/if}

								<div
									class=" inline-flex items-center justify-center border-white {cellClasses(
										cell,
										selected
									)}"
									class:h-6={!tiny}
									class:w-6={!tiny}
									class:h-4={tiny}
									class:w-4={tiny}
									class:bg-yellow-400={cell.hilight && cell.state !== true}
									class:bg-black={cell.state === true}
									class:bg-gray-200={cell.state === undefined}
									on:mousedown={() => clickCell(cell)}
									on:keyup|stopPropagation|preventDefault={() => clickCell(cell)}
									on:mouseenter={(e) => onMouseEnterCell(e, cell)}
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
				<div
					class="text-md flex flex-col items-start space-y-2 rounded-md bg-green-100 p-2"
					style="margin-top: {colsGuideWidth}px"
				>
					<h1 class="font-bold">JBK Designer</h1>
					<button
						class="rounded-md border-2 border-purple-800 bg-purple-200 p-1"
						on:click={clearHighlights}
					>
						Clear highlights
					</button>
					<button
						class="rounded-md border-2 border-purple-800 bg-purple-200 p-1"
						on:click={clearAll}
					>
						Start over
					</button>
					<button
						class="rounded-md border-2 border-purple-800 bg-purple-200 p-1"
						on:click={onExport}
					>
						Export
					</button>
				</div>
			</div>
		</div>

		<Grid inputCols={cols} inputRows={rows} name="designer" id="designer" mutable={true} />

		<Solver guide={guideFromDesign} />
	</div>

	<textarea cols="100" rows="10">{exportAsInput}</textarea>
</div>
