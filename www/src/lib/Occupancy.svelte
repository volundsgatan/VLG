<script lang="ts">
	import { Icon, Eye, EyeOff } from 'svelte-hero-icons';
	export let occupancy: boolean;
</script>

{#if occupancy}
	<Icon src={Eye} class="h-6 w-6" />
{:else}
	<Icon src={EyeOff} class="h-6 w-6" />
{/if}
