<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import Guide from '$lib/jbk/Guide.svelte';

	export let guide:
		| {
				cols: number[][];
				rows: number[][];
		  }
		| undefined = undefined;
	export let name: string;
	export let id: string;
	export let saveState = false;
	export let withState: Cell[][] | undefined = undefined;
	export let showInstructions = false;
	export let showSidebar = false;
	export let mutable = false;
	export let inputCols: number | undefined = undefined;
	export let inputRows: number | undefined = undefined;
	export let showGuide = false;
	export let allowFalseState = true;

	const dispatch = createEventDispatcher();

	$: cols = inputCols || guide?.cols.length || 0;
	$: rows = inputRows || guide?.rows.length || 0;

	type Cell = {
		row: number;
		col: number;
		state?: boolean;

		hilight: boolean;
	};

	let state: Cell[][] = [];

	$: tiny = cols >= 25 || rows >= 25;
	$: widestRowGuide = guide?.rows.map((r) => r.length).sort((a, b) => b - a)[0] || 0;
	$: widestColGuide = guide?.cols.map((r) => r.length).sort((a, b) => b - a)[0] || 0;
	$: rowGuideWidth = showGuide ? widestRowGuide * (tiny ? 16 : 24) : 0;
	$: colsGuideWidth = showGuide ? widestColGuide * (tiny ? 16 : 24) : 0;

	$: {
		if (withState) {
			state = withState;
		}
	}

	type State = typeof state;

	type Position = [number, number];

	let cursor: Position = [-1, -1];
	let selected: Position[] = [];

	const save = () => {
		if (!saveState) {
			return;
		}
		localStorage.setItem('state-' + id, JSON.stringify({ state }));

		dispatch('stateChanged', {
			state
		});
	};

	const restore = () => {
		if (!saveState) {
			return;
		}

		const ls = localStorage.getItem('state-' + id);
		if (ls) {
			const js: { state: State } = JSON.parse(ls);
			if (js) {
				state = js.state;
				dispatch('stateChanged', {
					state
				});
			}
		}
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
		if (!mutable) {
			return;
		}

		const c = currentCell();
		let nextState;
		if (c.state === true) {
			if (allowFalseState) {
				nextState = false;
			} else {
				nextState = undefined;
			}
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

	const clearSelected = () => {
		if (!mutable) {
			return;
		}

		// set all selected to nextState
		for (const p of selected) {
			state[p[0]][p[1]].state = undefined;
			state[p[0]][p[1]].hilight = false;
		}

		save();
	};

	const toggleCurrentCellHilight = () => {
		if (!mutable) {
			return;
		}

		const cell = currentCell();

		for (const p of selected) {
			// state[p[0]][p[1]].state = undefined;
			state[p[0]][p[1]].hilight = !cell.hilight;
		}

		// setCellHilight(cell, !cell.hilight);
	};

	const clickCell = (cell: Cell) => {
		if (!mutable) {
			return;
		}

		cursor = [cell.row, cell.col];
		selected = [cursor];
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

	const clearHighlights = () => {
		if (!mutable) {
			return;
		}

		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < cols; c++) {
				state[r][c].hilight = false;
			}
		}
		save();
	};

	const clearAll = () => {
		if (!mutable) {
			return;
		}

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

	const onMouseEnterCell = (e: MouseEvent, cell: Cell) => {
		if (!mutable) {
			return;
		}

		if (e.buttons === 1) {
			cursor = [cell.row, cell.col];
			selected.push(cursor);
			selected = selected;
		}
	};

	const onWindowKeyDown = (e: KeyboardEvent) => {
		if (!mutable) {
			return;
		}

		if (e.code === 'Space') {
			toggleCurrentCell();
			e.preventDefault();
			e.stopPropagation();
			return;
		}

		if (e.key === 'Backspace') {
			clearSelected();
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

	onMount(() => {
		if (!withState) {
			for (let row = 0; row < rows; row++) {
				state.push(makeRow(row));
			}
			state = state;

			console.log('using fresh state', { rows, cols });
		} else {
			console.log('using input state');
			state = withState;
		}

		restore();
	});

	const fixGridSize = () => {
		if (!inputCols || !inputRows) {
			return;
		}

		// remove rows
		if (state.length > rows) {
			state = state.slice(0, rows);
		}
		// add rows
		if (state.length < rows) {
			for (let row = state.length; row < rows; row++) {
				state.push(makeRow(row));
			}
		}

		for (let [rowIdx, row] of state.entries()) {
			if (row.length > cols) {
				row = row.slice(0, cols);
			}
			if (row.length < cols) {
				for (let col = row.length; col < cols; col++) {
					row.push({
						row: rowIdx,
						col: col,
						state: undefined,
						hilight: false
					});
				}
			}

			state[rowIdx] = row;
		}

		state = state;
		save();
	};

	$: cols, fixGridSize();
	$: rows, fixGridSize();
</script>

<svelte:window on:keydown={(e) => onWindowKeyDown(e)} />

{#if state}
	<div class="flex min-h-full flex-col items-center space-y-4 bg-white p-2 text-black">
		<div class="flex flex-col space-y-4">
			<div class="flex justify-center space-x-4">
				<div class="flex flex-col">
					<!-- Column Guides -->
					{#if showGuide}
						<div class="flex ">
							<div style="width: {rowGuideWidth}px" />
							{#if state[0]}
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
										selected={cursor[1] === cell.col}
										{tiny}
									/>

									{#if cell.col % 5 === 4}
										<div class="h-full w-[2px] " />
									{/if}
								{/each}
							{/if}
						</div>
					{/if}

					{#each state as row}
						{@const rowNum = row[0].row}
						{#if rowNum === 0}
							<div class="h-[2px] bg-black" style="margin-left: {rowGuideWidth}px" />
						{/if}

						<div class="flex">
							{#if showGuide}
								<!-- Row Guides -->
								<Guide
									valid={validatedRows[rowNum] === true}
									invalid={validatedRows[rowNum] === false}
									guides={guide.rows[rowNum]}
									{rowGuideWidth}
									selected={cursor[0] === rowNum}
									{tiny}
								/>
							{/if}

							{#each row as cell}
								{#if cell.col === 0}
									<div class="h-full w-[2px] bg-black" />
								{/if}

								<div
									class="border-[1px] border-black/30 inline-flex items-center justify-center border-white {cellClasses(
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

								{#if cell.col % 5 === 4 || cell.col === row.length - 1}
									<div class="h-full w-[2px] bg-black" />
								{/if}
							{/each}
						</div>

						{#if rowNum % 5 === 4 || rowNum === state.length - 1}
							<div class="h-[2px] bg-black" style="margin-left: {rowGuideWidth}px" />
						{/if}
					{/each}
				</div>
				{#if showSidebar}
					<div
						class="text-md flex flex-col items-start space-y-2 rounded-md bg-green-100 p-2"
						style="margin-top: {colsGuideWidth}px"
					>
						<h1 class="font-bold">{name}</h1>
						<button
							class="rounded-md border-2 border-purple-800 bg-purple-200 p-1"
							on:click={validate}
						>
							Validate
						</button>
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
						<div>
							<a
								class="text-black underline"
								href="https://sv.wikipedia.org/wiki/Japanskt_bildkryss"
							>
								Regler
							</a>
						</div>
					</div>
				{/if}
			</div>

			{#if showInstructions}
				<div style="margin-left: {rowGuideWidth}px">
					<div><span class="font-mono">[space]</span> – Toggle cell [yes/no/undefined]</div>
					<div><span class="font-mono">[backspace]</span> – Clear cell</div>
					<div><span class="font-mono">z</span> – Hilight</div>
				</div>
			{/if}
		</div>
	</div>
{/if}
