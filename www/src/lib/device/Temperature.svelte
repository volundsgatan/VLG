<script lang="ts">
	export let temperature = 0;
	export let light = true;

	$: whole = temperature.toFixed(0);
	$: sub = ((temperature % 1) * 10).toString().substring(0, 1);
</script>

{#if temperature}
	<div
		class="text-xs"
		class:text-blue-800={light && temperature < 10}
		class:text-blue-200={!light && temperature < 10}
		class:text-red-800={light && temperature > 24}
		class:text-red-400={!light && temperature > 24}
	>
		<strong>{whole}<span class="hidden md:inline">.{sub}</span></strong>°C
	</div>
{/if}
