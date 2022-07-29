<script lang="ts">
	import "../app.css";
	import Links from "../lib/Links.svelte";
</script>

<main class="h-screen">
	<slot />
</main>

<footer class="bottom-0 fixed w-full">
	<Links/>
</footer>
