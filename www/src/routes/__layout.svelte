<script lang="ts">
	import '../app.css';
	import Links from '../lib/Links.svelte';
</script>

<main class="h-screen">
	<slot />
</main>

<footer class="fixed bottom-0 w-full">
	<Links />
</footer>
