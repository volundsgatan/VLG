<script lang="ts">
	const rows = 15;
	const cols = 15;

	type Cell = {
		row: number;
		col: number;
		state?: boolean;
	};

	const state: Cell[][] = [];

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

	state[1][1].state = true;
	state[2][2].state = false;

	let selected: number[] = [0, 0];

	const toggleCell = (cell: Cell) => {
		if (cell.state === true) {
			cell.state = false;
		} else if (cell.state === false) {
			cell.state = undefined;
		} else {
			cell.state = true;
		}
		state[cell.row][cell.col] = cell;
		selected = [cell.row, cell.col];
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

	const moveCursor = (e: KeyboardEvent) => {
		if (e.code === 'Space') {
			toggleCurrentCell();
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
		}

		selected = [clamp(0, rows, selected[0] + dy), clamp(0, cols, selected[1] + dx)];
	};

	const guide = {
		rows: [
			[3, 4],
			[1, 1, 1],
			[3, 4],
			[1, 1, 1],
			[3, 4],
			[1, 1, 1],
			[3, 4],
			[1, 1, 1,1,1,1,],
			[3, 4],
			[1, 1, 1],
			[3, 4],
			[1, 1, 18],
			[1, 1, 1],
			[3, 4],
			[1, 1, 18],
		],
		cols: [
			[3, 4],
			[1, 1, 1],
			[3, 4],
			[1, 1, 1],
			[3, 4],
			[1, 1, 1],
			[3, 4],
			[1, 1, 1,1,1,1],
			[3, 4],
			[1, 1, 1],
			[3, 4],
			[1, 1, 18],
			[1, 1, 1],
			[3, 4],
			[1, 1, 18],
		]
	};
</script>

<svelte:window on:keydown|stopPropagation|preventDefault={(e) => moveCursor(e)} />

<div class=" h-full bg-white text-black ">
	<div class="flex justify-center p-20">
		<div class="flex flex-col">
			<div class="flex ">
				<div class="w-40" />

				{#each state[0] as cell}
					<div class="flex flex-col">
						<div class="flex-1" />

						{#if guide.cols[cell.col]}
							{#each guide.cols[cell.col] as g}
								<div
									class="h-8 w-8 flex-shrink-0 border-b-[1px] border-gray-800 text-center leading-8 text-gray-800"
								>
									{g}
								</div>
							{/each}
						{/if}
					</div>
				{/each}
			</div>

            



			{#each state as row}
				{@const rowNum = row[0].row}

                {#if rowNum === 0}
                    <div class="h-[2px] bg-gray-400 ml-40" />
                {/if}

				<div class="flex">
					<div class="flex w-40">
						<div class="flex-1" />
						{#if guide.rows[rowNum]}
							{#each guide.rows[rowNum] as g}
								<div
									class="h-8 w-8 flex-shrink-0  border-r-[1px] border-gray-800 text-center leading-8 text-gray-800 "
								>
									{g}
								</div>
							{/each}
						{/if}
					</div>


                    


					{#each row as cell}

                    {#if cell.col === 0 }
							<div class="h-full w-[2px] bg-gray-400" />
						{/if}

						<div
							class="h-8 w-8 border-2 text-center text-gray-800"
							class:bg-black={cell.state === true}
							class:border-white={cell.state === undefined && !isSelected(cell, selected)}
							class:bg-gray-200={cell.state === undefined}
							class:border-red-800={isSelected(cell, selected)}
							on:click|stopPropagation|preventDefault={() => toggleCell(cell)}
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
					<div class="h-[2px] bg-gray-400 ml-40" />
				{/if}
			{/each}
		</div>
	</div>
</div>
