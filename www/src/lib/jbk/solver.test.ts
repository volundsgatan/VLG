import { describe, expect, test } from '@jest/globals';
import {
	type Cell,
	getGuidePossibleRanges,
	getGuidePossibleRangesOneDirection,
	type GuideRange,
	solveEdegs,
	solveMinimumEdge,
	solveNextToBlocked,
	solveOverlapsBasic,
	trimLeft
} from './solver';

describe('solver', () => {
	test('solveEdegs', () => {
		const guide = [3, 6, 2];
		const cells: Cell[] = Array(15);

		for (let i = 0; i < 15; i++) {
			cells[i] = { state: undefined };
		}
		cells[0].state = true;

		const res = solveEdegs(guide, cells);

		const expected: Cell[] = [
			{ state: true },
			{ state: true },
			{ state: true },
			{ state: false },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined }
		];

		expect(res).toStrictEqual(expected);
	});

	test('solveEdegs/preblocked', () => {
		const guide = [3, 6, 2];
		const cells: Cell[] = Array(15);

		for (let i = 0; i < 15; i++) {
			cells[i] = { state: undefined };
		}
		cells[0].state = false;
		cells[1].state = true;

		const res = solveEdegs(guide, cells);

		const expected: Cell[] = [
			{ state: false },
			{ state: true },
			{ state: true },
			{ state: true },
			{ state: false },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined }
		];

		expect(res).toStrictEqual(expected);
	});

	test('solveMinimumEdge', () => {
		const guide = [4, 4];
		const cells: Cell[] = Array(15);

		for (let i = 0; i < 15; i++) {
			cells[i] = { state: undefined };
		}
		cells[2].state = true;

		const res = solveMinimumEdge(guide, cells);

		const expected: Cell[] = [
			{ state: undefined },
			{ state: undefined },
			{ state: true },
			{ state: true },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined }
		];

		expect(res).toStrictEqual(expected);
	});

	test('solveMinimumEdge/withOffset', () => {
		const guide = [4, 4];
		const cells: Cell[] = Array(15);

		for (let i = 0; i < 15; i++) {
			cells[i] = { state: undefined };
		}
		cells[0].state = false;
		cells[2].state = true;
		cells[3].state = true;

		const res = solveMinimumEdge(guide, cells);

		const expected: Cell[] = [
			{ state: false },
			{ state: undefined },
			{ state: true },
			{ state: true },
			{ state: true },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined }
		];

		expect(res).toStrictEqual(expected);
	});

	test('solveOverlapsBasic', () => {
		const guide = [10];
		const cells: Cell[] = Array(15);

		for (let i = 0; i < 15; i++) {
			cells[i] = { state: undefined };
		}

		const res = solveOverlapsBasic(guide, cells);

		const expected: Cell[] = [
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },

			{ state: true },
			{ state: true },
			{ state: true },
			{ state: true },
			{ state: true },

			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined }
		];

		expect(res).toStrictEqual(expected);
	});

	test('solveOverlapsBasic/withExisting', () => {
		const guide = [1, 6, 1];

		const cells: Cell[] = [
			{ state: false },
			{ state: true },
			{ state: false },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: false },
			{ state: true },
			{ state: false }
		];

		const res = solveOverlapsBasic(guide, cells);

		const expected: Cell[] = [
			{ state: false },
			{ state: true },
			{ state: false },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: true },
			{ state: true },
			{ state: true },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: false },
			{ state: true },
			{ state: false }
		];

		expect(res).toStrictEqual(expected);
	});

	/*test("solveNoSpace", () => {
    const guide = [2, 4];
    const cells: Cell[] = Array(15);

    for (let i = 0; i < 15; i++) {
      cells[i] = { state: undefined };
    }
    cells[0].state = false;
    cells[1].state = true;
    cells[2].state = true;
    cells[3].state = false;
    cells[6].state = false;

    const res = solveNoSpace(guide, cells);

    const expected: Cell[] = [
      { state: false },
      { state: true },
      { state: true },
      { state: false },
      { state: false },
      { state: false },
      { state: false },
      { state: undefined },
      { state: undefined },
      { state: undefined },
      { state: undefined },
      { state: undefined },
      { state: undefined },
      { state: undefined },
      { state: undefined },
    ];

    expect(res).toStrictEqual(expected);
  });*/

	test('solveNextToBlocked', () => {
		const guide = [2, 1, 1, 2];
		const cells: Cell[] = Array(15);

		for (let i = 0; i < 15; i++) {
			cells[i] = { state: undefined };
		}
		cells[0].state = false;
		cells[2].state = true;
		cells[3].state = true;
		cells[4].state = false;

		const res = solveNextToBlocked(guide, cells);

		const expected: Cell[] = [
			{ state: false },
			{ state: false },
			{ state: true },
			{ state: true },
			{ state: false },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined },
			{ state: undefined }
		];

		expect(res).toStrictEqual(expected);
	});

	test('trimLeft', () => {
		const guide = [2, 1, 1, 2];
		const cells: Cell[] = Array(15);

		for (let i = 0; i < 15; i++) {
			cells[i] = { state: undefined };
		}

		const res = trimLeft(guide, cells);

		expect(res.guideStart).toStrictEqual(0);
		expect(res.cellsStart).toStrictEqual(0);

		cells[0].state = false;
		cells[1].state = true;
		cells[2].state = true;
		cells[3].state = false;

		const res2 = trimLeft(guide, cells);

		expect(res2.guideStart).toStrictEqual(1);
		expect(res2.cellsStart).toStrictEqual(4);

		cells[4].state = false;
		cells[5].state = false;
		cells[6].state = false;

		const res3 = trimLeft(guide, cells);

		expect(res3.guideStart).toStrictEqual(1);
		expect(res3.cellsStart).toStrictEqual(7);

		cells[4].state = false;
		cells[5].state = true;
		cells[6].state = false;

		const res4 = trimLeft(guide, cells);

		expect(res4.guideStart).toStrictEqual(2);
		expect(res4.cellsStart).toStrictEqual(7);
	});

	test('getGuidePossibleRangesOneDirection', () => {
		const guide = [1, 10, 4];
		const cells: Cell[] = Array(35);

		for (let i = 0; i < 35; i++) {
			cells[i] = { state: undefined };
		}

		// ...
		cells[6].state = false;
		cells[7].state = true;
		cells[8].state = true;
		cells[9].state = true;
		cells[10].state = true;
		cells[11].state = true;
		cells[12].state = true;
		// ...
		cells[16].state = true;
		// ...

		const res = getGuidePossibleRangesOneDirection(guide, cells);

		const exp: GuideRange[] = [
			{
				start: 0,
				end: 5,
				guideIdx: 0,
				guideVal: 1
			},

			{
				start: 7,
				end: 34,
				guideIdx: 1,
				guideVal: 10
			},

			{
				start: 18, // 7 + 10 + 1,
				end: 34,
				guideIdx: 2,
				guideVal: 4
			}
		];

		expect(res).toStrictEqual(exp);
	});

	test('getGuidePossibleRanges', () => {
		const guide = [1, 10, 4];
		const cells: Cell[] = Array(35);

		for (let i = 0; i < 35; i++) {
			cells[i] = { state: undefined };
		}

		// ...
		cells[6].state = false;
		cells[7].state = true;
		cells[8].state = true;
		cells[9].state = true;
		cells[10].state = true;
		cells[11].state = true;
		cells[12].state = true;
		// ...
		cells[16].state = true;
		// ...

		const res = getGuidePossibleRanges(guide, cells);

		const exp: GuideRange[] = [
			{
				start: 0,
				end: 5,
				guideIdx: 0,
				guideVal: 1,
				len: 6
			},

			{
				start: 7,
				end: 16, // 34 - 4 - 1
				guideIdx: 1,
				guideVal: 10,
				len: 10
			},

			{
				start: 18,
				end: 34,
				guideIdx: 2,
				guideVal: 4,
				len: 17
			}
		];

		expect(res).toStrictEqual(exp);
	});

	test('getGuidePossibleRanges/10-completed', () => {
		const guide = [1, 10, 4];
		const cells: Cell[] = Array(35);

		for (let i = 0; i < 35; i++) {
			cells[i] = { state: undefined };
		}

		// ...
		cells[6].state = false;
		cells[7].state = true;
		cells[8].state = true;
		cells[9].state = true;
		cells[10].state = true;
		cells[11].state = true;
		cells[12].state = true;
		cells[13].state = true;
		cells[14].state = true;
		cells[15].state = true;
		cells[16].state = true;
		cells[17].state = false;

		const res = getGuidePossibleRanges(guide, cells);

		const exp: GuideRange[] = [
			{
				start: 0,
				end: 5,
				guideIdx: 0,
				guideVal: 1,
				len: 6
			},

			{
				start: 7,
				end: 16, // 34 - 4 - 1
				guideIdx: 1,
				guideVal: 10,
				len: 10
			},

			{
				start: 18,
				end: 34,
				guideIdx: 2,
				guideVal: 4,
				len: 17
			}
		];

		expect(res).toStrictEqual(exp);
	});

	test('getGuidePossibleRangesOneDirection/3-1-1-3', () => {
		const guide = [3, 1, 1, 3];
		const cells: Cell[] = Array(20);

		for (let i = 0; i < 20; i++) {
			cells[i] = { state: undefined };
		}

		cells[7].state = true;
		cells[8].state = true;

		/*
        01234 56789 01234 56789
                TT
    0:  XXXXX XXXXX XXXXX XXXXX
    1:      X XXXXX XXXXX XXXXX
    2:              XXXXX XXXXX
    3:                XXX XXXXX
    */

		const res = getGuidePossibleRangesOneDirection(guide, cells);

		const exp: GuideRange[] = [
			{ start: 0, end: 19, guideIdx: 0, guideVal: 3 },
			{ start: 4, end: 19, guideIdx: 1, guideVal: 1 },
			{ start: 10, end: 19, guideIdx: 2, guideVal: 1 },
			{ start: 12, end: 19, guideIdx: 3, guideVal: 3 }
		];

		expect(res).toStrictEqual(exp);
	});

	test('getGuidePossibleRangesOneDirection/3-1-1-3-flipped', () => {
		const guide = [3, 1, 1, 3];
		const cells: Cell[] = Array(20);

		for (let i = 0; i < 20; i++) {
			cells[i] = { state: undefined };
		}

		cells[11].state = true;
		cells[12].state = true;

		/*
        01234 56789 01234 56789
                     TT
    0:  XXXXX XXXXX XXXXX XXXXX
    1:      X XXXXX XXXXX XXXXX
    2:         XXXX XXXXX XXXXX
    3:           XX XXXXX XXXXX
    */

		const res = getGuidePossibleRangesOneDirection(guide, cells);

		const exp: GuideRange[] = [
			{ start: 0, end: 19, guideIdx: 0, guideVal: 3 },
			{ start: 4, end: 19, guideIdx: 1, guideVal: 1 },
			{ start: 6, end: 19, guideIdx: 2, guideVal: 1 },
			{ start: 8, end: 19, guideIdx: 3, guideVal: 3 }
		];

		expect(res).toStrictEqual(exp);
	});

	test('getGuidePossibleRanges/3-1-1-3', () => {
		const guide = [3, 1, 1, 3];
		const cells: Cell[] = Array(20);

		for (let i = 0; i < 20; i++) {
			cells[i] = { state: undefined };
		}

		cells[11].state = true;
		cells[12].state = true;

		/* (from left)
        01234 56789 01234 56789
                     TT
    0:  XXXXX XXXXX XXXXX XXXXX
    1:      X XXXXX XXXXX XXXXX
    2:         XXXX XXXXX XXXXX
    3:           XX XXXXX XXXXX
    */

		/* (from right)
        01234 56789 01234 56789
                     TT
    0:  XXXXX XXX
    3:  XXXXX XXXXX
    2:  XXXXX XXXXX XXXXX X
    1:  XXXXX XXXXX XXXXX XXXXX
    */

		/* (combined)
        01234 56789 01234 56789
                     TT
    0:  XXXXX XXX
    3:      X XXXXX
    2:         XXXX XXXXX X
    1:           XX XXXXX XXXXX
    */

		/* (single guide groups)
        01234 56789 01234 56789
                     TT
    0:  XXXXX XXX
    3:      X XXXXX
    2:         XXXX XXXXX X
    1:              XXXX
    */

		/* (adjusted)
        01234 56789 01234 56789
                     TT
    0:  XXXXX XXX
    3:      X XXXXX
    2:         XXXX XX
    1:              XXXX
    */

		const res = getGuidePossibleRanges(guide, cells);

		const exp: GuideRange[] = [
			{ start: 0, end: 7, guideIdx: 0, guideVal: 3, len: 8 },
			{ start: 4, end: 9, guideIdx: 1, guideVal: 1, len: 6 },
			{ start: 6, end: 11, guideIdx: 2, guideVal: 1, len: 6 },
			{ start: 10, end: 13, guideIdx: 3, guideVal: 3, len: 4 }
		];

		expect(res).toStrictEqual(exp);
	});
});
