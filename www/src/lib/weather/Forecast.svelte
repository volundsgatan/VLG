<script lang="ts">
	export let hour: number;
	export let temp: string;

	$: t = parseInt(parseFloat(temp).toFixed(0));
	$: h = hour.toFixed(0).padStart(2, '0');

	const getColor = (temp: number): string => {
		if (temp < 0) {
			return 'text-blue-800';
		}
		if (temp < 5) {
			return 'text-blue-600';
		}
		if (temp < 8) {
			return 'text-blue-800';
		}
		if (temp < 10) {
			return 'text-green-600';
		}
		if (temp < 12) {
			return 'text-green-700';
		}
		if (temp < 15) {
			return 'text-green-800';
		}
		if (temp < 18) {
			return 'text-green-900';
		}
		if (temp < 20) {
			return 'text-orange-500';
		}
		if (temp < 25) {
			return 'text-orange-800';
		}
		return 'text-red-800';
	};
</script>

<div class="p-2 text-center">
	<div class="text-sm text-gray-500">{h}</div>
	<div class="text-lg font-semibold {getColor(t)}">{t}°</div>
</div>
