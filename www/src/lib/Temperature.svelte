<script lang="ts">
    export let temperature;
    export let light : Boolean = true;
</script>

{#if temperature}
    <div
            class:text-blue-800={light && temperature < 10}
            class:text-blue-400={!light && temperature < 10}
            class:text-red-800={light && temperature > 24}
            class:text-red-400={!light && temperature > 24}
    >
        <strong>{temperature}</strong>°C
    </div>
{/if}
