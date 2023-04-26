<script lang="ts">
	export let hour: string;
	export let minute: string;
</script>

<div class="p-2 text-center inline-flex flex-col items-center">
	<div class="text-sm text-white">{hour}:{minute}</div>
	<img class="w-6 h-6 rotate-180" src="/yr_icons/01m.svg" />
	<div class="text-md text-white">Sunrise</div>
</div>
