<script lang="ts">
	export let contact: boolean;
	export let type: 'DOOR' | 'WINDOW';
</script>

{#if !contact}☀️{:else if type === 'DOOR'}🚪{:else}🪟{/if}
