<script lang="ts">
	import { Icon, LockClosed, LockOpen } from 'svelte-hero-icons';

	export let contact: boolean;
</script>

{#if !contact}
	<div class="h-2 w-2 rounded-full bg-red-400" />
{:else}
	<div class="h-2 w-2 rounded-full bg-green-400" />
{/if}
