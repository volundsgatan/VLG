<script lang="ts">
	import { Icon, LockClosed, LockOpen } from "svelte-hero-icons";

	export let contact: boolean;
</script>

{#if !contact}
	<Icon src="{LockOpen}" class="h-6 w-6 text-red-800" />
{:else}
	<Icon src="{LockClosed}" class="h-6 w-6" />
{/if}
