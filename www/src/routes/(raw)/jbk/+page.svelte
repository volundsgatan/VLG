<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="flex min-h-full flex-col items-center bg-white p-12 text-black">
	<div>
		<h1 class="text-xl">Japanska Bildkryss</h1>

		<ul class="text-gray-800">
			{#each data.games as game}
				<li><a href="/jbk/{game.id}">{game.name}</a></li>
			{/each}
		</ul>
	</div>
</div>
