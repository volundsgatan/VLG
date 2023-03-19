<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="flex min-h-full flex-col items-center bg-white p-12 text-black">
	<div class="space-y-4">
		<h1 class="text-xl">Japanska Bildkryss</h1>

		<ul class="text-gray-800 max-w-80 space-y-0.5">
			{#each data.games as game}
				<li class="hover:text-black">
					<div class="flex gap-4 justify-between">
						<a href="/jbk/{game.id}">{game.name}</a>
						<span class="font-mono">[{game.rows}x{game.cols}]</span>
					</div>
				</li>
			{/each}
		</ul>

		<ul class="text-gray-800 max-w-80 space-y-0.5">
			<li class="font-medium"><a href="/jbk/designer">✏️ Skapa ett eget kryss</a></li>
		</ul>
	</div>
</div>
