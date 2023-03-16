import { describe, expect, test } from "@jest/globals";
import {
  type Cell,
  getGuidePossibleRanges,
  getGuidePossibleRangesOneDirection,
  type GuideRange,
  solveEdegs,
  solveMinimumEdge,
  solveNextToBlocked,
  solveNoSpace,
  solveOutOfReach,
  solveOverlaps,
  trimLeft,
} from "./solver";

describe("solver", () => {
  test("solveEdegs", () => {
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
      { state: undefined },
    ];

    expect(res).toStrictEqual(expected);
  });

  test("solveEdegs/preblocked", () => {
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
      { state: undefined },
    ];

    expect(res).toStrictEqual(expected);
  });

  test("solveMinimumEdge", () => {
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
      { state: undefined },
    ];

    expect(res).toStrictEqual(expected);
  });

  test("solveMinimumEdge/withOffset", () => {
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
      { state: undefined },
    ];

    expect(res).toStrictEqual(expected);
  });

  /*test("solveOutOfReach", () => {
    const guide = [3];
    const cells: Cell[] = Array(15);

    for (let i = 0; i < 15; i++) {
      cells[i] = { state: undefined };
    }
    cells[8].state = true;

    const res = solveOutOfReach(guide, cells);

    const expected: Cell[] = [
      { state: false },
      { state: false },
      { state: false },
      { state: false },
      { state: false },
      { state: false },
      { state: undefined },
      { state: undefined },
      { state: true },
      { state: undefined },
      { state: undefined },
      { state: undefined },
      { state: undefined },
      { state: undefined },
      { state: undefined },
    ];

    expect(res).toStrictEqual(expected);
  });*/

  test("solveOverlaps", () => {
    const guide = [10];
    const cells: Cell[] = Array(15);

    for (let i = 0; i < 15; i++) {
      cells[i] = { state: undefined };
    }

    const res = solveOverlaps(guide, cells);

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
      { state: undefined },
    ];

    expect(res).toStrictEqual(expected);
  });

  test("solveOverlaps/withExisting", () => {
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
      { state: false },
    ];

    const res = solveOverlaps(guide, cells);

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
      { state: false },
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

  test("solveNextToBlocked", () => {
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
      { state: undefined },
    ];

    expect(res).toStrictEqual(expected);
  });

  test("trimLeft", () => {
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

  test("getGuidePossibleRangesOneDirection", () => {
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
        guideVal: 1,
      },

      {
        start: 7,
        end: 34,
        guideIdx: 1,
        guideVal: 10,
      },

      {
        start: 18, // 7 + 10 + 1,
        end: 34,
        guideIdx: 2,
        guideVal: 4,
      },
    ];

    expect(res).toStrictEqual(exp);
  });

  test("getGuidePossibleRanges", () => {
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
      },

      {
        start: 7,
        end: 16, // 34 - 4 - 1
        guideIdx: 1,
        guideVal: 10,
      },

      {
        start: 18,
        end: 34,
        guideIdx: 2,
        guideVal: 4,
      },
    ];

    expect(res).toStrictEqual(exp);
  });

  test("getGuidePossibleRanges/10-completed", () => {
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
      },

      {
        start: 7,
        end: 16, // 34 - 4 - 1
        guideIdx: 1,
        guideVal: 10,
      },

      {
        start: 18,
        end: 34,
        guideIdx: 2,
        guideVal: 4,
      },
    ];

    expect(res).toStrictEqual(exp);
  });
});
