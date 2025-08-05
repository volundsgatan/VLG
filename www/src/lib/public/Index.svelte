<script lang="ts">
	import { onMount } from 'svelte';
	import config from '$lib/config';

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

<div class="bg-green-50 min-h-screen font-light">
	<div class="text-gray-700 w-80 mx-auto py-12 flex flex-col space-y-4">
		<h1 class="text-4xl font-thin text-gray-800">Westling.life</h1>

		{#if canAccessApp}
			<h2 class="text-xl text-gray-800">Smart Home</h2>
			<a href="/app" class="bg-green-200 rounded-xl p-4 hover:bg-green-300">
				<h2 class="text-lg font-medium text-black">Välkommen hem {name}</h2>
				<span>Gå till appen 🏠</span>
			</a>
		{/if}

		<div class="flex flex-col space-y-2">
			<h2 class="text-xl text-gray-800">Apps</h2>

			<a class="px-2 py-1 bg-green-200 hover:bg-green-300 rounded-md" href="/jbk">JBK</a>

			<a
				class="px-2 py-1 bg-green-200 hover:bg-green-300 rounded-md"
				href="https://gustavwestling.com">Gustav</a
			>

			<a
				class="px-2 py-1 bg-green-200 hover:bg-green-300 rounded-md"
				href="https://elinwestling.com">Elin</a
			>

			<a
				class="px-2 py-1 bg-green-200 hover:bg-green-300 rounded-md"
				href="https://franswestling.com">Frans</a
			>

			<!-- <a
				class="px-2 py-1 bg-green-200 hover:bg-green-300 rounded-md"
				href="https://factorio-map.vlg.life">Factorio Maps</a
			> -->
			<a
				class="px-2 py-1 bg-green-200 hover:bg-green-300 rounded-md"
				href="https://github.com/volundsgatan/VLG">Source Code</a
			>
		</div>

		{#if canAccessApp}
			<div class="flex flex-col space-y-2">
				<h2 class="text-xl text-gray-800">Tools</h2>
				<a
					class="px-2 py-1 bg-green-200 hover:bg-green-300 rounded-md"
					href="https://grafana.unicorn-alligator.ts.net">Grafana</a
				>
				<a
					class="px-2 py-1 bg-green-200 hover:bg-green-300 rounded-md"
					href="https://zigbee2mqtt.unicorn-alligator.ts.net/#/">Z2M</a
				>
			</div>
		{/if}
	</div>
</div>
