<script lang="ts">
	import { Icon, LockClosed, LockOpen } from "svelte-hero-icons";

	export let contact: boolean;
</script>

{#if !contact}
	<Icon solid src="{LockOpen}" class="h-6 w-6 text-red-600" />
{:else}
	<Icon src="{LockClosed}" class="h-6 w-6" />
{/if}
