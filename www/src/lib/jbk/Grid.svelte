<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import Guide from '$lib/jbk/Guide.svelte';
	import Timer from './Timer.svelte';

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
	export let showUndoRedo = false;
	export let showGoToSolver = false;

	let timerSeconds = 0;
	let timerPaused = false;

	const dispatch = createEventDispatcher();

	$: cols = inputCols || guide?.cols.length || 0;
	$: rows = inputRows || guide?.rows.length || 0;

	type Cell = {
		row: number;
		col: number;
		state?: boolean;

		hilight: boolean;
		hilightRed?: boolean;
		hilightGreen?: boolean;
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

	let history: string[] = []; // states as JSON
	let historyIdx = 0;

	type Position = [number, number];

	let cursor: Position = [-1, -1];
	let selected: Position[] = [];

	const save = (addToHistory: boolean) => {
		if (!saveState) {
			return;
		}
		localStorage.setItem('state-' + id, JSON.stringify({ state }));

		dispatch('stateChanged', {
			state
		});

		// add to history
		if (addToHistory) {
			if (historyIdx !== history.length - 1) {
				history = history.slice(0, historyIdx + 1);
			}
			history.push(JSON.stringify(state));
			history = history;
			historyIdx = history.length - 1;
		}

		// run validator
		validate();
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
				save(true);
			}
		}
	};

	$: canUndo = historyIdx > 0;
	$: canRedo = history.length - 1 > historyIdx;

	const undo = () => {
		if (canUndo) {
			historyIdx--;
			state = JSON.parse(history[historyIdx]);
			save(false);
		}
	};

	const redo = () => {
		if (canRedo) {
			historyIdx++;
			state = JSON.parse(history[historyIdx]);
			save(false);
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

		save(true);
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

		save(true);
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

		save(true);
	};

	const clickCell = (cell: Cell) => {
		if (!mutable) {
			return;
		}

		cursor = [cell.row, cell.col];
		selected = [cursor];
	};

	let autoValidate = false;

	const validate = () => {
		if (!autoValidate) {
			validatedRows = [];
			validatedCols = [];
			return;
			// clear
		}

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

	$: autoValidate, validate();

	const clearHighlights = () => {
		if (!mutable) {
			return;
		}

		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < cols; c++) {
				state[r][c].hilight = false;
			}
		}
		save(true);
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

		save(true);
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

		if (guide.length === 1 && guide[0] === 0) {
			guide = [];
		}

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

		if (e.key === 'a') {
			toggleCurrentCellHilight();
			e.preventDefault();
			e.stopPropagation();
			return;
		}

		if (e.key.toLowerCase() === 'z' || e.code.toLowerCase() === 'z') {
			const ctrLike = e.metaKey || e.ctrlKey;
			if (e.shiftKey && ctrLike) {
				redo();
			} else if (ctrLike) {
				undo();
			}
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

		const timerInterval = setInterval(() => {
			if (!timerPaused) {
				timerSeconds++;
			}
		}, 1000);

		return () => {
			clearInterval(timerInterval);
		};
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
		save(true);
	};

	$: cols, fixGridSize();
	$: rows, fixGridSize();
</script>

<svelte:window on:keydown={(e) => onWindowKeyDown(e)} />

{#if timerPaused}
	<div class="flex flex-col items-center gap-4 p-2">
		<div>Pausad!</div>
		<div>
			<button
				class="rounded-md border-2 bg-purple-200 border-purple-800 p-1 px-2"
				on:click={() => (timerPaused = false)}
			>
				▶️
			</button>
		</div>
	</div>
{:else if state}
	<div class="flex min-h-full flex-col items-center space-y-4 bg-white p-2 text-black">
		<div class="flex flex-col space-y-4">
			<div class="flex justify-center space-x-4">
				<div class="flex flex-col">
					<!-- Column Guides -->
					{#if showGuide && guide}
						<div class="flex">
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
										<div class="h-full w-[2px]" />
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
							{#if showGuide && guide}
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
									class:!border-red-800={cell.hilightRed}
									class:!border-green-800={cell.hilightGreen}
									class:!border-4={cell.hilightRed || cell.hilightGreen}
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

						{#if showUndoRedo}
							<div class="flex justify-between items-center w-full">
								<Timer seconds={timerSeconds} />

								<button
									class="rounded-md border-2 bg-purple-200 border-purple-800 p-1 px-2"
									on:click={() => (timerPaused = true)}
								>
									⏸️
								</button>
							</div>

							<div class="flex space-x-2">
								<button
									class="rounded-md border-2 p-1"
									class:bg-purple-200={canUndo}
									class:border-purple-800={canUndo}
									class:bg-gray-300={!canUndo}
									class:border-gray-600={!canUndo}
									disabled={!canUndo}
									on:click={undo}
								>
									↩️
								</button>
								<button
									class="rounded-md border-2 border-purple-800 p-1"
									class:bg-purple-200={canRedo}
									class:border-purple-800={canRedo}
									class:bg-gray-300={!canRedo}
									class:border-gray-600={!canRedo}
									disabled={!canRedo}
									on:click={redo}
								>
									↪️
								</button>
							</div>
						{/if}

						{#if showGuide}
							<div class="relative flex items-start">
								<div class="flex h-6 items-center">
									<input
										id="comments"
										aria-describedby="comments-description"
										name="comments"
										type="checkbox"
										bind:checked={autoValidate}
										class="h-4 w-4 rounded border-gray-300 text-purple-800 focus:ring-indigo-600 checked:bg-red-200"
									/>
								</div>
								<div class="ml-3 text-sm leading-6">
									<label for="comments" class="font-medium">Rätta</label>
								</div>
							</div>
						{/if}

						<button
							class="rounded-md border-2 border-purple-800 bg-purple-200 p-1"
							on:click={clearHighlights}
						>
							Rensa markeringar
						</button>
						<button
							class="rounded-md border-2 border-purple-800 bg-purple-200 p-1"
							on:click={clearAll}
						>
							Börja om
						</button>
						{#if showGoToSolver}
							<a
								class="rounded-md border-2 border-purple-800 bg-purple-200 p-1"
								href="/jbk/solver/{id}"
							>
								Lösning
							</a>
						{/if}
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
					<div><span class="font-mono">[space]</span> – Cycla svar [ja/nej/tom]</div>
					<div><span class="font-mono">[backspace]</span> – Rensa cell</div>
					<div><span class="font-mono">A</span> – Markera</div>
					<div><span class="font-mono">Ctrl/⌘ + <kbd>Z</kbd></span> – Ångra</div>
					<div><span class="font-mono">Ctrl/⌘ + Shift + Z</span> – Upprepa</div>
				</div>
			{/if}
		</div>
	</div>
{/if}
