<script lang="ts">
	import "../app.css";
	import Links from "../lib/Links.svelte";
</script>

<main class="h-full">
	<slot />
</main>

<footer class="bottom-0 fixed w-full">
	<Links/>
</footer>
