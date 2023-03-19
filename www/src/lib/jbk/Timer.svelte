<script lang="ts">
	export let seconds: number;

	const padLeft = (s: string): string => {
		if (s.length === 1) {
			return `0${s}`;
		}
		return s;
	};

	$: m = padLeft(parseInt(seconds / 60).toFixed(0));
	$: s = padLeft(parseInt(seconds % 60).toFixed(0));
</script>

<span class="font-mono">
	{m}:{s}
</span>
