import type { PageLoad } from './$types';

export const prerender = false;

export const load: PageLoad = () => {
	const nalle = {
		id: 'nalle',
		rows: [
			[4, 3, 4],
			[3, 1, 1, 3],
			[1, 1],
			[1, 1],
			[1, 1, 1, 1],

			[1, 2, 2, 1],
			[2, 2],
			[2, 3, 2],
			[4, 4],
			[1, 11, 1],

			[4, 4],
			[3, 3],
			[1, 2, 1, 2, 1],
			[2, 1, 1, 2],
			[4, 4]
		],
		cols: [
			[3],
			[2, 4, 1, 3],
			[3, 6, 2],
			[2, 4, 3],
			[1, 1, 2, 1, 1],
			[1, 2, 1, 2],
			[1, 1, 1],
			[1, 1, 1, 1],
			[1, 1, 1],
			[1, 2, 1, 2],
			[1, 1, 2, 1, 1],
			[2, 4, 3],
			[3, 6, 2],
			[2, 4, 1, 3],
			[3]
		],
		solution: {
			state: [
				[
					{ row: 0, col: 0, state: false },
					{ row: 0, col: 1, state: true },
					{ row: 0, col: 2, state: true },
					{ row: 0, col: 3, state: true },
					{ row: 0, col: 4, state: true },
					{ row: 0, col: 5, state: false },
					{ row: 0, col: 6, state: true },
					{ row: 0, col: 7, state: true },
					{ row: 0, col: 8, state: true },
					{ row: 0, col: 9, state: false },
					{ row: 0, col: 10, state: true },
					{ row: 0, col: 11, state: true },
					{ row: 0, col: 12, state: true },
					{ row: 0, col: 13, state: true },
					{ row: 0, col: 14, state: false }
				],
				[
					{ row: 1, col: 0, state: false },
					{ row: 1, col: 1, state: true },
					{ row: 1, col: 2, state: true },
					{ row: 1, col: 3, state: true },
					{ row: 1, col: 4, state: false },
					{ row: 1, col: 5, state: true },
					{ row: 1, col: 6, state: false },
					{ row: 1, col: 7, state: false },
					{ row: 1, col: 8, state: false },
					{ row: 1, col: 9, state: true },
					{ row: 1, col: 10, state: false },
					{ row: 1, col: 11, state: true },
					{ row: 1, col: 12, state: true },
					{ row: 1, col: 13, state: true },
					{ row: 1, col: 14, state: false }
				],
				[
					{ row: 2, col: 0, state: false },
					{ row: 2, col: 1, state: false },
					{ row: 2, col: 2, state: true },
					{ row: 2, col: 3, state: false },
					{ row: 2, col: 4, state: false },
					{ row: 2, col: 5, state: false },
					{ row: 2, col: 6, state: false },
					{ row: 2, col: 7, state: false },
					{ row: 2, col: 8, state: false },
					{ row: 2, col: 9, state: false },
					{ row: 2, col: 10, state: false },
					{ row: 2, col: 11, state: false },
					{ row: 2, col: 12, state: true },
					{ row: 2, col: 13, state: false },
					{ row: 2, col: 14, state: false }
				],
				[
					{ row: 3, col: 0, state: false },
					{ row: 3, col: 1, state: true },
					{ row: 3, col: 2, state: false },
					{ row: 3, col: 3, state: false },
					{ row: 3, col: 4, state: false },
					{ row: 3, col: 5, state: false },
					{ row: 3, col: 6, state: false },
					{ row: 3, col: 7, state: false },
					{ row: 3, col: 8, state: false },
					{ row: 3, col: 9, state: false },
					{ row: 3, col: 10, state: false },
					{ row: 3, col: 11, state: false },
					{ row: 3, col: 12, state: false },
					{ row: 3, col: 13, state: true },
					{ row: 3, col: 14, state: false }
				],
				[
					{ row: 4, col: 0, state: false },
					{ row: 4, col: 1, state: true },
					{ row: 4, col: 2, state: false },
					{ row: 4, col: 3, state: false },
					{ row: 4, col: 4, state: false },
					{ row: 4, col: 5, state: true },
					{ row: 4, col: 6, state: false },
					{ row: 4, col: 7, state: false },
					{ row: 4, col: 8, state: false },
					{ row: 4, col: 9, state: true },
					{ row: 4, col: 10, state: false },
					{ row: 4, col: 11, state: false },
					{ row: 4, col: 12, state: false },
					{ row: 4, col: 13, state: true },
					{ row: 4, col: 14, state: false }
				],
				[
					{ row: 5, col: 0, state: false },
					{ row: 5, col: 1, state: true },
					{ row: 5, col: 2, state: false },
					{ row: 5, col: 3, state: false },
					{ row: 5, col: 4, state: true },
					{ row: 5, col: 5, state: true },
					{ row: 5, col: 6, state: false },
					{ row: 5, col: 7, state: false },
					{ row: 5, col: 8, state: false },
					{ row: 5, col: 9, state: true },
					{ row: 5, col: 10, state: true },
					{ row: 5, col: 11, state: false },
					{ row: 5, col: 12, state: false },
					{ row: 5, col: 13, state: true },
					{ row: 5, col: 14, state: false }
				],
				[
					{ row: 6, col: 0, state: false },
					{ row: 6, col: 1, state: true },
					{ row: 6, col: 2, state: true },
					{ row: 6, col: 3, state: false },
					{ row: 6, col: 4, state: false },
					{ row: 6, col: 5, state: false },
					{ row: 6, col: 6, state: false },
					{ row: 6, col: 7, state: false },
					{ row: 6, col: 8, state: false },
					{ row: 6, col: 9, state: false },
					{ row: 6, col: 10, state: false },
					{ row: 6, col: 11, state: false },
					{ row: 6, col: 12, state: true },
					{ row: 6, col: 13, state: true },
					{ row: 6, col: 14, state: false }
				],
				[
					{ row: 7, col: 0, state: false },
					{ row: 7, col: 1, state: false },
					{ row: 7, col: 2, state: true },
					{ row: 7, col: 3, state: true },
					{ row: 7, col: 4, state: false },
					{ row: 7, col: 5, state: false },
					{ row: 7, col: 6, state: true },
					{ row: 7, col: 7, state: true },
					{ row: 7, col: 8, state: true },
					{ row: 7, col: 9, state: false },
					{ row: 7, col: 10, state: false },
					{ row: 7, col: 11, state: true },
					{ row: 7, col: 12, state: true },
					{ row: 7, col: 13, state: false },
					{ row: 7, col: 14, state: false }
				],
				[
					{ row: 8, col: 0, state: false },
					{ row: 8, col: 1, state: true },
					{ row: 8, col: 2, state: true },
					{ row: 8, col: 3, state: true },
					{ row: 8, col: 4, state: true },
					{ row: 8, col: 5, state: false },
					{ row: 8, col: 6, state: false },
					{ row: 8, col: 7, state: false },
					{ row: 8, col: 8, state: false },
					{ row: 8, col: 9, state: false },
					{ row: 8, col: 10, state: true },
					{ row: 8, col: 11, state: true },
					{ row: 8, col: 12, state: true },
					{ row: 8, col: 13, state: true },
					{ row: 8, col: 14, state: false }
				],
				[
					{ row: 9, col: 0, state: true },
					{ row: 9, col: 1, state: false },
					{ row: 9, col: 2, state: true },
					{ row: 9, col: 3, state: true },
					{ row: 9, col: 4, state: true },
					{ row: 9, col: 5, state: true },
					{ row: 9, col: 6, state: true },
					{ row: 9, col: 7, state: true },
					{ row: 9, col: 8, state: true },
					{ row: 9, col: 9, state: true },
					{ row: 9, col: 10, state: true },
					{ row: 9, col: 11, state: true },
					{ row: 9, col: 12, state: true },
					{ row: 9, col: 13, state: false },
					{ row: 9, col: 14, state: true }
				],
				[
					{ row: 10, col: 0, state: true },
					{ row: 10, col: 1, state: true },
					{ row: 10, col: 2, state: true },
					{ row: 10, col: 3, state: true },
					{ row: 10, col: 4, state: false },
					{ row: 10, col: 5, state: false },
					{ row: 10, col: 6, state: false },
					{ row: 10, col: 7, state: false },
					{ row: 10, col: 8, state: false },
					{ row: 10, col: 9, state: false },
					{ row: 10, col: 10, state: false },
					{ row: 10, col: 11, state: true },
					{ row: 10, col: 12, state: true },
					{ row: 10, col: 13, state: true },
					{ row: 10, col: 14, state: true }
				],
				[
					{ row: 11, col: 0, state: true },
					{ row: 11, col: 1, state: true },
					{ row: 11, col: 2, state: true },
					{ row: 11, col: 3, state: false },
					{ row: 11, col: 4, state: false },
					{ row: 11, col: 5, state: false },
					{ row: 11, col: 6, state: false },
					{ row: 11, col: 7, state: false },
					{ row: 11, col: 8, state: false },
					{ row: 11, col: 9, state: false },
					{ row: 11, col: 10, state: false },
					{ row: 11, col: 11, state: false },
					{ row: 11, col: 12, state: true },
					{ row: 11, col: 13, state: true },
					{ row: 11, col: 14, state: true }
				],
				[
					{ row: 12, col: 0, state: false },
					{ row: 12, col: 1, state: true },
					{ row: 12, col: 2, state: false },
					{ row: 12, col: 3, state: true },
					{ row: 12, col: 4, state: true },
					{ row: 12, col: 5, state: false },
					{ row: 12, col: 6, state: false },
					{ row: 12, col: 7, state: true },
					{ row: 12, col: 8, state: false },
					{ row: 12, col: 9, state: false },
					{ row: 12, col: 10, state: true },
					{ row: 12, col: 11, state: true },
					{ row: 12, col: 12, state: false },
					{ row: 12, col: 13, state: true },
					{ row: 12, col: 14, state: false }
				],
				[
					{ row: 13, col: 0, state: false },
					{ row: 13, col: 1, state: false },
					{ row: 13, col: 2, state: true },
					{ row: 13, col: 3, state: true },
					{ row: 13, col: 4, state: false },
					{ row: 13, col: 5, state: true },
					{ row: 13, col: 6, state: false },
					{ row: 13, col: 7, state: false },
					{ row: 13, col: 8, state: false },
					{ row: 13, col: 9, state: true },
					{ row: 13, col: 10, state: false },
					{ row: 13, col: 11, state: true },
					{ row: 13, col: 12, state: true },
					{ row: 13, col: 13, state: false },
					{ row: 13, col: 14, state: false }
				],
				[
					{ row: 14, col: 0, state: false },
					{ row: 14, col: 1, state: false },
					{ row: 14, col: 2, state: true },
					{ row: 14, col: 3, state: true },
					{ row: 14, col: 4, state: true },
					{ row: 14, col: 5, state: true },
					{ row: 14, col: 6, state: false },
					{ row: 14, col: 7, state: false },
					{ row: 14, col: 8, state: false },
					{ row: 14, col: 9, state: true },
					{ row: 14, col: 10, state: true },
					{ row: 14, col: 11, state: true },
					{ row: 14, col: 12, state: true },
					{ row: 14, col: 13, state: false },
					{ row: 14, col: 14, state: false }
				]
			]
		}
	};

	const guide = {
		rows: [
			[3, 4],
			[1, 1, 1],
			[3, 4],
			[1, 1, 1],
			[3, 4],
			[1, 1, 1],
			[3, 4],
			[1, 1, 1, 1, 1, 1],
			[3, 4],
			[1, 1, 1],
			[3, 4],
			[1, 1, 18],
			[1, 1, 1],
			[3, 4],
			[1, 1, 18]
		],
		cols: [
			[3, 4],
			[1, 1, 1],
			[3, 4],
			[1, 1, 1],
			[3, 4],
			[1, 1, 1],
			[3, 4],
			[1, 1, 1, 1, 1, 1],
			[3, 4],
			[1, 1, 1],
			[3, 4],
			[1, 1, 18],
			[1, 1, 1],
			[3, 4],
			[1, 1, 18]
		]
	};

	return {
		guide: nalle,
		rows: 15,
		cols: 15
	};
};
