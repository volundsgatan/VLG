<script lang="ts">
	export let suit: '♠' | '♣' | '♥' | '♦' = '♠';
	export let value: number = 1;

	const names: Record<number, string> = {
		11: 'J',
		12: 'Q',
		13: 'K',
		14: 'A'
	};

	$: displayValue = names[value] || value.toString();

	const fontColors = {
		'♠': 'text-black',
		'♣': 'text-black',
		'♥': 'text-red-700',
		'♦': 'text-red-700'
	};

	const borderColors = {
		'♠': 'border-black',
		'♣': 'border-black',
		'♥': 'border-red-700',
		'♦': 'border-red-700'
	};

	$: displayFontColor = fontColors[suit];
	$: displayBorderColor = borderColors[suit];
</script>

<div
	class="bg-white border-2 {displayBorderColor} {displayFontColor} h-[60px] w-[50px] inline-flex justify-between gap-1 p-1"
>
	<div>{suit}</div>
	<div>{displayValue}</div>
</div>
