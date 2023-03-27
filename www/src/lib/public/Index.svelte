<script lang="ts">
	import { onMount } from 'svelte';

	let wowRealVisitorCounter = 73;
	let canAccessApp = false;

	onMount(() => {
		const int = setInterval(() => {
			const delta = Math.random() * 4 - 2;
			wowRealVisitorCounter = Math.round(wowRealVisitorCounter + delta);
		}, 1500);

		fetch('https://sonos.unicorn-alligator.ts.net/state')
			.then(() => {
				canAccessApp = true;
			})
			.catch(() => {
				canAccessApp = false;
			});

		return () => {
			clearInterval(int);
		};
	});
</script>

<div class="bg-gray-100 min-h-screen">
	<div class="text-gray-700 w-80 mx-auto py-4 flex flex-col space-y-4">
		<h1 class="text-2xl font-bold text-black">VLG is LIFE</h1>
		{#if canAccessApp}
			<div>
				<h2 class="text-lg font-medium tetx-black">Välkommen hem</h2>
			</div>
		{/if}

		<div>
			<h2 class="text-lg font-medium tetx-black">Program och sånt</h2>

			<ol class="list-disc list-inside">
				<li>
					<a href="/jbk">JBK (<span>J</span>apanska <span>b</span>ild<span>k</span>ryss)</a>
				</li>
			</ol>
		</div>

		<p class="border-l-2 border-gray-400 text-gray-500 pl-2 ">
			Oj här var det mycket grejer.<br />
			&mdash; Mamma
		</p>

		<div>
			Besökare just nu: {wowRealVisitorCounter}
		</div>
	</div>
</div>
