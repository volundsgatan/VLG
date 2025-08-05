<script lang="ts">
	// import type { PageData } from './$types';

	import Card from '$lib/idioten/Card.svelte';
	import { MultiGames } from '$lib/idioten/idioten';
	import { tick } from 'svelte';

	let multiGames = new MultiGames();
	let winCount = 0;
	let lostCount = 0;
	let gameCount = 0;

	const step = () => {
		while (true) {
			winCount = multiGames.games.filter((game) => game.isWon).length;
			lostCount = multiGames.games.filter((game) => game.isLost).length;
			gameCount = multiGames.games.length;

			const completedCount = winCount + lostCount;
			if (completedCount === multiGames.games.length) {
				console.log('all games completed');
				// return;
				break;
			}

			try {
				multiGames.step();
				multiGames = multiGames;
			} catch (e) {
				console.log('stop loop', e);
				break;
			}
		}
	};

	const reset = async () => {
		multiGames = new MultiGames();
		winCount = 0;
		lostCount = 0;
		gameCount = 0;

		await tick();

		step();
	};
</script>

<div class="flex min-h-full flex-col items-center bg-white p-12 text-black">
	<div class="space-y-4">
		<h1 class="text-xl">Idioten</h1>

		<button on:click={step}>Step</button>
		<button on:click={reset}>Reset</button>

		<div class="flex gap-4">
			<div>Games: {gameCount}</div>
			<div>Wins: {winCount}</div>
			<div>Lost: {lostCount}</div>
		</div>

		<div class="flex gap-4 flex-col">
			{#each multiGames.games as game, gameIdx}
				<div class={game.isWon ? 'bg-green-400' : ''}>
					Game {gameIdx}

					{#if game.isWon}
						<div>Won</div>
					{/if}

					{#if game.isLost}
						<div>Lost</div>
					{/if}

					<div class="flex gap-4 flex-row">
						{#each game.tableStacks as stack, stackIdx}
							{#if stack.length === 0}
								<div class="bg-gray-200 h-[60px] w-[50px]"></div>
							{:else}
								<div class="flex flex-col">
									{#each stack as card, ii}
										<div class={ii == 0 ? '' : 'bg-red-200 -mt-6'}>
											<Card suit={card.suit} value={card.value} />
										</div>
									{/each}
								</div>
							{/if}
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
