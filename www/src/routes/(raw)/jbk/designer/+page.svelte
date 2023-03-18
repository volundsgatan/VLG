<script lang="ts">
	import { onMount } from 'svelte';
	import Solver from '$lib/jbk/Solver.svelte';
	import Grid from '$lib/jbk/Grid.svelte';
	import Button from '$lib/jbk/Button.svelte';

	let cols = 20;
	let rows = 20;

	type Cell = {
		row: number;
		col: number;
		state?: boolean;

		hilight: boolean;
	};

	let state: Cell[][] = [];

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
	type Guide = {
		rows: number[][];
		cols: number[][];
	};

	let guideFromDesign: Guide | undefined = undefined;

	const makeGuide = (): Guide | undefined => {
		if (!state || state.length === 0) {
			return undefined;
		}

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

		exportAsInput = JSON.stringify({
			id: 'designer',
			name: 'designer',
			rows: d.rows,
			cols: d.cols
		});

		return d;
	};

	const onDesignerStateChanged = (event) => {
		console.log('onDesignerStateChanged', event);
		state = event.detail.state;
		makeGuide();
	};

	onMount(() => {
		makeGuide();
	});
</script>

<div class="flex min-h-full flex-col items-center bg-white p-2 text-black">
	<div class="flex items-end w-full justify-around">
		<div>
			<div>
				Columns: {cols}
				<Button
					on:click={() => {
						cols = cols - 1;
					}}>-</Button
				>
				<Button
					on:click={() => {
						cols = cols + 1;
					}}>+</Button
				>
			</div>
			<div>
				Rows: {rows}
				<Button
					on:click={() => {
						rows = rows - 1;
					}}>-</Button
				>
				<Button
					on:click={() => {
						rows = rows + 1;
					}}>+</Button
				>
			</div>
			<Grid
				inputCols={cols}
				inputRows={rows}
				name="JBK Designer"
				id="designer"
				mutable={true}
				saveState={true}
				showSidebar={true}
				allowFalseState={false}
				on:stateChanged={(e) => onDesignerStateChanged(e)}
			/>
		</div>

		<div class="flex items-center flex-col">
			<h2 class="text-lg font-medium">Solver</h2>
			{#if guideFromDesign}
				<Solver guide={guideFromDesign} />
			{/if}
		</div>
	</div>

	{#if exportAsInput}
		<textarea cols="100" rows="10" class="font-mono">{exportAsInput}</textarea>
	{/if}
</div>
