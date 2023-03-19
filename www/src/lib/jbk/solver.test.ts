import { describe, expect, test } from '@jest/globals';
import {
	type Cell,
	getGuidePossibleRanges,
	getGuidePossibleRangesOneDirection,
	type GuideRange,
	solveEdges,
	solveMinimumEdge,
	solveNextToBlocked,
	solveOverlapsBasic,
	trimLeft,
	groupPossibleSizes,
	solveOverlapsSlidingRanges
} from './solver';

describe('solver', () => {
	test('solveEdges', () => {
		const guide = [3, 6, 2];
		const cells: Cell[] = Array(15);

		for (let i = 0; i < 15; i++) {
			cells[i] = { state: undefined };
		}
		cells[0].state = true;

		const res = solveEdges(guide, cells);

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

	test('solveEdges/preblocked', () => {
		const guide = [3, 6, 2];
		const cells: Cell[] = Array(15);

		for (let i = 0; i < 15; i++) {
			cells[i] = { state: undefined };
		}
		cells[0].state = false;
		cells[1].state = true;

		const res = solveEdges(guide, cells);

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
    1:  XXXXX XXXXX
    2:  XXXXX XXXXX XXXXX X
    3:  XXXXX XXXXX XXXXX XXXXX
    */

		/* (combined)
        01234 56789 01234 56789
                     TT
    0:  XXXXX XXX
    1:      X XXXXX
    2:         XXXX XXXXX X
    3:           XX XXXXX XXXXX
    */

		/* (single guide groups)
        01234 56789 01234 56789
                     TT
    0:  XXXXX XXX
    1:      X XXXXX
    2:         XXXX XXXXX X
    3:              XXXX
    */

		/* (adjusted)
        01234 56789 01234 56789
                     TT
    0:  XXXXX X 
    3:      X XXX
    2:         XXXX
    1:              XXXX
    */

		const res = getGuidePossibleRanges(guide, cells);

		const exp: GuideRange[] = [
			{ start: 0, end: 5, guideIdx: 0, guideVal: 3, len: 6 },
			{ start: 4, end: 7, guideIdx: 1, guideVal: 1, len: 4 },
			{ start: 6, end: 9, guideIdx: 2, guideVal: 1, len: 4 },
			{ start: 10, end: 13, guideIdx: 3, guideVal: 3, len: 4 }
		];

		expect(res).toStrictEqual(exp);
	});

	test('getGuidePossibleRanges/4-2', () => {
		const guide = [4, 2];
		const cells: Cell[] = Array(20);

		for (let i = 0; i < 20; i++) {
			cells[i] = { state: undefined };
		}

		cells[7].state = false;
		cells[8].state = false;
		cells[9].state = false;
		cells[10].state = true;
		// gap
		cells[12].state = true;

		/* (adjusted)
        01234 56789 01234 56789
                FFF T T
    0:  XXXXX XXXXX XXXXX XX
    1:        XXXXX XXXXX XXXXX
    */

		const res = getGuidePossibleRanges(guide, cells);

		const exp: GuideRange[] = [
			{ start: 10, end: 13, guideIdx: 0, guideVal: 4, len: 4 },
			{ start: 15, end: 19, guideIdx: 1, guideVal: 2, len: 5 }
		];

		expect(res).toStrictEqual(exp);
	});

	test('getGuidePossibleRanges/1-1-3-1', () => {
		const guide = [1, 1, 3, 1];
		const cells: Cell[] = Array(20);

		for (let i = 0; i < 20; i++) {
			cells[i] = { state: undefined };
		}

		cells[4].state = false;
		// ...
		cells[8].state = false;
		// ...
		cells[10].state = true; // must be first 1
		cells[11].state = false;
		cells[12].state = true; // must be second 1
		cells[13].state = false;

		/* (adjusted)
        01234 56789 01234 56789
            F    F  TFTF
    0:              X
    1:                X
    2:                  X XXX
    3:                       XX
    */

		const res = getGuidePossibleRanges(guide, cells);

		const exp: GuideRange[] = [
			{ start: 10, end: 10, guideIdx: 0, guideVal: 1, len: 1 },
			{ start: 12, end: 12, guideIdx: 1, guideVal: 1, len: 1 },
			{ start: 14, end: 17, guideIdx: 2, guideVal: 3, len: 4 },
			{ start: 18, end: 19, guideIdx: 3, guideVal: 1, len: 2 }
		];

		expect(res).toStrictEqual(exp);
	});

	test('getGuidePossibleRanges/bunny-1-3-1-1-solved', () => {
		const guide = [1, 3, 1, 1];
		const cells: Cell[] = Array(15);

		for (let i = 0; i < 15; i++) {
			cells[i] = { state: undefined };
		}

		cells[0].state = false;
		cells[1].state = false;
		cells[2].state = false;
		cells[3].state = true; // T
		cells[4].state = false;
		cells[5].state = false;
		cells[6].state = true; // T
		cells[7].state = true; // T
		cells[8].state = true; // T
		cells[9].state = false;
		cells[10].state = true; // T
		cells[11].state = false;
		cells[12].state = true; // T
		cells[13].state = false;
		cells[14].state = false;

		const res = getGuidePossibleRanges(guide, cells);

		const exp: GuideRange[] = [
			{ start: 3, end: 3, guideIdx: 0, guideVal: 1, len: 1 },
			{ start: 6, end: 8, guideIdx: 1, guideVal: 3, len: 3 },
			{ start: 10, end: 10, guideIdx: 2, guideVal: 3, len: 1 },
			{ start: 12, end: 12, guideIdx: 3, guideVal: 1, len: 1 }
		];

		expect(res).toStrictEqual(exp);
	});

	test('getGuidePossibleRangesOneDirection/bunny-1-3-1-1-solved', () => {
		const guide = [1, 3, 1, 1];
		const cells: Cell[] = Array(15);

		for (let i = 0; i < 15; i++) {
			cells[i] = { state: undefined };
		}

		cells[0].state = false;
		cells[1].state = false;
		cells[2].state = false;
		cells[3].state = true; // T
		cells[4].state = false;
		cells[5].state = false;
		cells[6].state = true; // T
		cells[7].state = true; // T
		cells[8].state = true; // T
		cells[9].state = false;
		cells[10].state = true; // T
		cells[11].state = false;
		cells[12].state = true; // T
		cells[13].state = false;
		cells[14].state = false;

		const res = getGuidePossibleRangesOneDirection(guide, cells);

		const exp: GuideRange[] = [
			{ start: 3, end: 12, guideIdx: 0, guideVal: 1 },
			{ start: 6, end: 12, guideIdx: 1, guideVal: 3 },
			{ start: 10, end: 12, guideIdx: 2, guideVal: 1 },
			{ start: 12, end: 12, guideIdx: 3, guideVal: 1 }
		];

		expect(res).toStrictEqual(exp);
	});

	test('getGuidePossibleRangesOneDirection/bunny-1-3-1-1-solved/reverse', () => {
		const guide = [1, 1, 3, 1];
		const cells: Cell[] = Array(15);

		for (let i = 0; i < 15; i++) {
			cells[i] = { state: undefined };
		}

		cells[0].state = false;
		cells[1].state = false;
		cells[2].state = true; // T
		cells[3].state = false;
		cells[4].state = true; // T
		cells[5].state = false;
		cells[6].state = true; // T
		cells[7].state = true; // T
		cells[8].state = true; // T
		cells[9].state = false;
		cells[10].state = false;
		cells[11].state = true; // T
		cells[12].state = false;
		cells[13].state = false;
		cells[14].state = false;

		const res = getGuidePossibleRangesOneDirection(guide, cells);

		const exp: GuideRange[] = [
			{ start: 2, end: 11, guideIdx: 0, guideVal: 1 },
			{ start: 4, end: 11, guideIdx: 1, guideVal: 1 },
			{ start: 6, end: 11, guideIdx: 2, guideVal: 3 },
			{ start: 11, end: 11, guideIdx: 3, guideVal: 1 }
		];

		expect(res).toStrictEqual(exp);
	});

	test('groupPossibleSizes', () => {
		const cells: Cell[] = Array(20);

		for (let i = 0; i < 20; i++) {
			cells[i] = { state: undefined };
		}

		cells[2].state = false;

		cells[4].state = true;
		cells[5].state = true;

		cells[7].state = false;
		cells[8].state = false;
		cells[9].state = false;
		cells[10].state = true;
		// gap
		cells[12].state = true;

		cells[14].state = true;
		cells[15].state = true;
		cells[16].state = true;

		const sortNum = (a: number, b: number): number => {
			return a - b;
		};

		expect([...groupPossibleSizes(10, 10, cells)].sort(sortNum)).toStrictEqual([1, 3, 7, 8, 9, 10]);
		expect([...groupPossibleSizes(12, 12, cells)].sort(sortNum)).toStrictEqual([
			1, 3, 5, 6, 7, 8, 9, 10
		]);
		expect([...groupPossibleSizes(10, 12, cells)].sort(sortNum)).toStrictEqual([3, 7, 8, 9, 10]);

		expect([...groupPossibleSizes(14, 16, cells)].sort(sortNum)).toStrictEqual([
			3, 4, 5, 6, 7, 8, 9, 10
		]);

		expect([...groupPossibleSizes(1, 1, cells)].sort(sortNum)).toStrictEqual([1, 2]);

		expect([...groupPossibleSizes(4, 5, cells)].sort(sortNum)).toStrictEqual([2, 3, 4]);
	});

	test('solveOverlapsSlidingRanges/single-cell', () => {
		const guide = [1];
		const cells: Cell[] = Array(1);

		for (let i = 0; i < 1; i++) {
			cells[i] = { state: undefined };
		}

		const res = solveOverlapsSlidingRanges(guide, cells);

		const expected: Cell[] = [{ state: true }];

		expect(res).toStrictEqual(expected);
	});
});
