<script lang="ts">
	import { onMount } from 'svelte';
	import config from '$lib/config'

	let canAccessApp = false;
	let name = 'Mr. Boss';

	const usernames = config.accounts;

	onMount(() => {
		fetch(`https://meta.${config.hostname}/whoami`)
			.then((response) => response.json())
			.then((res) => {
				canAccessApp = true;
				name = usernames.get(res.user) || 'Mr. Boss';
			})
			.catch(() => {
				canAccessApp = false;
			});
	});
</script>

<div class="bg-green-50 min-h-screen">
	<div class="text-gray-700 w-80 mx-auto py-12 flex flex-col space-y-4">
		<h1 class="text-4xl font-thin text-gray-800">VLG</h1>

		{#if canAccessApp}
			<a href="/app" class="bg-green-200 rounded-xl p-4">
				<h2 class="text-lg font-medium text-black">Välkommen hem {name}</h2>
				<span>Gå till appen 🏠</span>
			</a>
		{/if}

		<div>
			<h2 class="text-lg font-medium tetx-black">Program och sånt</h2>
			<ol class="list-disc list-inside">
				<li>
					<a href="/jbk">JBK (<span>J</span>apanska <span>b</span>ild<span>k</span>ryss)</a>
				</li>
				<li>
					<a href="https://github.com/volundsgatan/VLG">Källkod</a>
				</li>
			</ol>
		</div>
	</div>
</div>
