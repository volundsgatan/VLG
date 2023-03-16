export type Cell = {
  state: boolean | undefined;
  hilight?: boolean;
  hilight2?: boolean;
};

export const solveOverlaps = (
  guide: number[],
  cells: Cell[],
): Cell[] => {
  const left = Array(cells.length);

  // from left
  let pos = 0;
  for (const [idx, g] of guide.entries()) {
    // if already blocked, skip

    if (!cells[pos]) {
      // break;
    }
    for (; cells[pos] && cells[pos].state === false; pos++) {
      //xx
    }
    if (!cells[pos]) {
      // break;
    }

    // move with g
    for (let i = 0; i < g; i++) {
      left[pos] = idx;
      pos++;
    }
    pos++;
  }

  // from right
  const right = Array(cells.length);
  pos = cells.length - 1;

  for (let idx = guide.length - 1; idx >= 0; idx--) {
    if (!cells[pos]) {
      //  break;
    }
    for (; cells[pos] && cells[pos].state === false; pos--) {
      //xx
    }
    if (!cells[pos]) {
      // break;
    }

    const g = guide[idx];
    for (let i = 0; i < g; i++) {
      right[pos] = idx;
      pos--;
    }
    pos--;
  }

  // find overlaps
  for (const [idx] of cells.entries()) {
    if (left[idx] >= 0 && left[idx] === right[idx]) {
      cells[idx].state = true;
    }
  }

  return cells;
};

export const solveEdegs = (
  guide: number[],
  cells: Cell[],
): Cell[] => {
  let offset = 0;

  for (; cells[offset] && cells[offset].state === false; offset++) {
    // advance
  }
  if (!cells[offset]) {
    return cells;
  }

  // fill in first guide and end with stop
  if (cells[offset].state === true) {
    let idx = 0;
    for (idx = 0; idx < guide[0]; idx++) {
      cells[idx + offset].state = true;
    }
    if (cells[idx + offset]) {
      cells[idx + offset].state = false;
    }
  }

  return cells;
};

export const trimLeft = (guide: number[], cells: Cell[]): {
  guideStart: number;
  cellsStart: number;
} => {
  let guideStart = 0;
  let cellsStart = 0;

  for (const [idx, c] of cells.entries()) {
    if (c.state === false && idx > 0 && cells[idx - 1].state === true) {
      cellsStart = idx;
      guideStart++;
    }
    if (c.state === undefined) {
      break;
    }
  }

  // keep going as long as false
  while (cells[cellsStart] && cells[cellsStart].state === false) {
    cellsStart++;
  }

  return {
    guideStart,
    cellsStart,
  };
};

export const solveMinimumEdge = (
  guide: number[],
  cells: Cell[],
): Cell[] => {
  // remove completed guides from left

  let any = false;

  let offset = 0;
  for (; cells[offset] && cells[offset].state === false; offset++) {
    // xx
  }
  if (!cells[offset]) {
    return cells;
  }

  for (let idx = 0; idx < guide[0]; idx++) {
    if (cells[offset + idx].state === true) {
      any = true;
    }
    if (any) {
      cells[offset + idx].state = true;
    }
  }
  return cells;
};

type Region = { start: number; end: number; hasTrue: boolean };

const detectRegions = (cells: Cell[]): Region[] => {
  let regionStart = 0;
  let regionHasTrue = false;

  const regions: Region[] = [];

  for (const [idx, c] of cells.entries()) {
    if (c.state === true || c.state === undefined) {
      if (regionStart === -1) {
        regionStart = idx;
      }
    }

    if (c.state === true) {
      regionHasTrue = true;
    }

    if (c.state === false) {
      if (regionStart > -1) {
        regions.push({
          start: regionStart,
          hasTrue: regionHasTrue,
          end: idx - 1,
        });
      }
      regionStart = -1;
      regionHasTrue = false;
    }
  }
  if (regionStart > -1) {
    regions.push({
      start: regionStart,
      hasTrue: regionHasTrue,
      end: cells.length - 1,
    });
  }
  return regions;
};

export const solveOutOfReach = (
  guide: number[],
  cells: Cell[],
): Cell[] => {
  const regions = detectRegions(cells);
  const regionsWithTrue = regions.filter((r) => r.hasTrue);
  const regionsWithFalse = regions.filter((r) => !r.hasTrue);

  if (regionsWithTrue.length === guide.length) {
    // fill all non-true regions with false
    for (const r of regionsWithFalse) {
      for (let idx = r.start; idx < r.end; idx++) {
        cells[idx].state = false;
      }
    }

    for (const [idx, r] of regionsWithTrue.entries()) {
      let first = -1;
      let last = -1;
      for (let idx = r.start; idx <= r.end; idx++) {
        if (cells[idx].state === true) {
          if (first === -1) {
            first = idx;
          }
          last = idx;
        }
      }

      // fill between
      for (let idx = first; idx <= last; idx++) {
        cells[idx].state = true;
      }

      // fill false where out of reach
      const len = last - first + 1;
      const range = guide[idx] - len;

      for (let idx = r.start; idx <= r.end; idx++) {
        if (idx < first - range) {
          cells[idx].state = false;
        }
        if (idx > last + range) {
          cells[idx].state = false;
        }
      }
    }
  }

  return cells;
};

const min = (...nums: number[]): number => {
  let r = nums[0];
  for (const n of nums) {
    if (n < r) {
      r = n;
    }
  }
  return r;
};

const max = (...nums: number[]): number => {
  let r = nums[0];
  for (const n of nums) {
    if (n > r) {
      r = n;
    }
  }
  return r;
};

const blockLength = (cells: Cell[], idx: number): number => {
  if (cells[idx].state !== true) {
    return 0;
  }

  let start = idx;

  while (cells[start - 1] && cells[start - 1].state === true) {
    start--;
  }

  let end = idx;

  while (cells[end + 1] && cells[end + 1].state === true) {
    end++;
  }

  return end - start + 1;
};

type Range = {
  start: number;
  end: number;
  len?: number;
};

// Find groups of true cells that are connected
const findGroups = (cells: Cell[]): Range[] => {
  const res: Range[] = [];

  let start = -1;
  for (const [idx, c] of cells.entries()) {
    if (c.state === true && start === -1) {
      start = idx;
    }
    if (c.state !== true && start > -1) {
      res.push({
        start: start,
        end: idx - 1,
        len: idx - start,
      });
      start = -1;
    }
  }
  if (start > -1) {
    res.push({
      start: start,
      end: cells.length - 1,
      len: cells.length - start,
    });
  }

  return res;
};

const containsBlockedWithinN = (
  cells: Cell[],
  start: number,
  n: number,
): boolean => {
  const blockedCellsIdx = cells.map((c, idx) => {
    return {
      ...c,
      idx,
    };
  }).filter((c) => c.state === false).map((c) => c.idx);

  for (let i = 0; i < n; i++) {
    if (blockedCellsIdx.indexOf(start + i) > -1) {
      return true;
    }
  }
  return false;
};

const containsTrueWithinN = (
  cells: Cell[],
  start: number,
  n: number,
): boolean => {
  const trueCellsIdx = cells.map((c, idx) => {
    return {
      ...c,
      idx,
    };
  }).filter((c) => c.state === true).map((c) => c.idx);
  for (let i = 0; i < n; i++) {
    if (trueCellsIdx.indexOf(start + i) > -1) {
      return true;
    }
  }
  return false;
};

type GuideRange = Range & {
  guideIdx: number;
  guideVal: number;
};

const simpleFirstPossibleStarts = (
  guide: number[],
  cells: Cell[],
): number[] => {
  const firstPossibleStarts: number[] = [];

  let idx = 0;
  for (const [guideIdx, g] of guide.entries()) {
    firstPossibleStarts.push(idx);
    idx += g;
    for (; cells[idx] && cells[idx].state === true; idx++) {
      // x
    }
    idx++;
    // lookahead: if the idx cell is a part of a group thats
    // longer than the next guide, move ahead..
    // if (cells[idx] && cells[idx].state === true) {
    //   if (blockLength(cells, idx) > guide[guideIdx + 1]) {
    //     // x
    //     // idx +=
    //     for (; cells[idx] && cells[idx].state === true; idx++) {
    //       // x
    //     }
    //   }
    // }
  }

  return firstPossibleStarts;
};

const getGuidePossibleRangesOneDirection = (
  guide: number[],
  cells: Cell[],
): GuideRange[] => {
  const groups = findGroups(cells);
  const firstPossibleStarts = simpleFirstPossibleStarts(guide, cells);

  const guidePossibleRanges: GuideRange[] = [];
  for (const [idx, guideVal] of guide.entries()) {
    let start = firstPossibleStarts[idx];

    // if guide does not fit after start, push start forwards
    // can not contain any blocked cells within guideSize cells
    while (true) {
      if (containsBlockedWithinN(cells, start, guideVal)) {
        start++;
      } else {
        break;
      }
    }

    // if end is blocked, move backwards to non blocked
    // for (; cells[end] && cells[end].state === false; end--) {
    //   //xx
    // }

    // if is completed, adjust start and end
    //if (debug) {
    // const startAt = groups.filter((g) => g.start === start);
    // if (startAt.length === 1 && startAt[0].len === guideVal) {
    //   end = startAt[0].end;
    // }
    // }

    // fix guide positions based on already solved blocks
    const groupsAfterStart = groups.filter((g) => g.start >= start);
    const guidesAfterCurrent = guide.slice(idx + 1);
    const largestGuideAfterCurrent = max(-1, ...guidesAfterCurrent);

    // push start after groups that are too big
    for (const grp of groupsAfterStart) {
      if (grp.len && grp.len > guideVal && grp.len > largestGuideAfterCurrent) {
        if (grp.end > start) {
          start = grp.end + 1;
        }
      }
    }

    // push forward start... again
    while (true) {
      if (containsBlockedWithinN(cells, start, guideVal)) {
        start++;
      } else {
        break;
      }
    }

    // now when we know where it starts.. find the end!
    const tooLargeGroups = groups.filter((g) =>
      g.len &&
      g.len > guideVal &&
      g.start > start
    );

    let end = cells.length - 1;

    // guide range must end before the too large group
    if (tooLargeGroups.length > 0) {
      end = tooLargeGroups[0].start - 1;
    }

    while (true) {
      if (cells[end] && cells[end].state === false) {
        end--;
        continue;
      }
      break;
    }

    // if end is on blocked, move forwards
    while (true) {
      if (containsBlockedWithinN(cells, end - guideVal, guideVal)) {
        end--;
      } else {
        break;
      }
    }

    guidePossibleRanges.push({
      start,
      end,
      guideIdx: idx,
      guideVal: guideVal,
    });
  }

  return guidePossibleRanges;
};

const getGuidePossibleRanges = (
  guide: number[],
  cells: Cell[],
): GuideRange[] => {
  const debug = arrayEquals(guide, [3, 1, 1, 1, 1, 6, 1]);

  const first = getGuidePossibleRangesOneDirection(guide, cells);

  // flip it, and get from the second direction
  const revGuide = copyGuide(guide).reverse();
  const revCells = copyCells(cells).reverse();
  const second = getGuidePossibleRangesOneDirection(revGuide, revCells);

  if (debug) {
    // cells[0].hilight = true;
    console.log({ first, second });
  }

  // adjust ends of first based on starts of second
  const combined = first.map((range, idx) => {
    const r = range;
    const otherEnd = cells.length - second[second.length - idx - 1].start - 1;
    r.end = min(r.end, otherEnd);
    return r;
  });

  const groups = findGroups(cells);

  // if there are groups that are only within one guide, adjust that guide to the group (plus surrounding)
  const singleGuideGroups = detectSingleGuideGroups(
    groups,
    combined,
  );

  if (debug) {
    console.log({ singleGuideGroups });
  }

  for (const [idx, range] of combined.entries()) {
    if (singleGuideGroups[idx]) {
      let groups = singleGuideGroups[idx];

      let minStart = min(...groups.map((g) => g.start));
      let maxEnd = max(...groups.map((g) => g.end));

      combined[idx] = {
        ...range,
        start: minStart,
        end: maxEnd,
      };

      if (debug) {
        console.log("adjusting...", { range, minStart, maxEnd });
      }
    }
  }

  return combined;
};

const detectSingleGuideGroups = (
  groups: Range[],
  guidePossibleRanges: GuideRange[],
): Record<number, Range[]> => {
  const singleGuideGroups: Record<number, Range[]> = {};

  // groups that can only be in one guide
  // group == marked cells
  // guide == numbers
  for (const g of groups) {
    const groupPossibleGuides = guidePossibleRanges.filter((r) =>
      r.start <= g.start && r.end >= g.end
    );

    if (groupPossibleGuides.length === 1) {
      const guide = groupPossibleGuides[0];
      if (!singleGuideGroups[guide.guideIdx]) {
        singleGuideGroups[guide.guideIdx] = [];
      }
      singleGuideGroups[guide.guideIdx].push(g);
    }
  }

  return singleGuideGroups;
};

export const solveOutOfReachWithSlidingStarts = (
  guide: number[],
  cells: Cell[],
): Cell[] => {
  const groups = findGroups(cells);

  if (groups.length === 0) {
    return cells;
  }

  // const debug = arrayEquals(guide, [5, 3, 4]);
  let debug = arrayEquals(guide, [4, 2, 3]) ||
    arrayEquals(guide, [4, 5]) ||
    arrayEquals(guide, [4, 2, 4]) ||
    arrayEquals(guide, [4, 14]) ||
    arrayEquals(guide, [10, 3, 6]) ||
    arrayEquals(guide, [3, 6, 3, 6, 6]) ||
    arrayEquals(guide, [2, 6, 1, 5]);

  debug = arrayEquals(guide, [2, 6, 1, 5]);
  debug = arrayEquals(guide, [1, 1, 9, 8, 1, 2]);
  debug = //arrayEquals(guide, [1, 6, 9]) ||
    arrayEquals(guide, [3, 1, 1, 1, 1, 6, 1]);

  const guidePossibleRanges = getGuidePossibleRanges(guide, cells);

  if (debug) {
    console.log({ guidePossibleRanges });
    for (const r of guidePossibleRanges) {
      cells[r.start].hilight = true;
      cells[r.end].hilight2 = true;
    }
  }

  const singleGuideGroups = detectSingleGuideGroups(
    groups,
    guidePossibleRanges,
  );

  return cells;

  for (const [guideIdx, groups] of Object.entries(singleGuideGroups)) {
    let start = groups[0].start;
    let end = groups[0].end;
    for (const g of groups) {
      if (g.start < start) {
        start = g.start;
      }
      if (g.end > end) {
        end = g.end;
      }
    }

    // if more than 1 group, merge them
    if (groups.length > 1) {
      for (let idx = start; idx <= end; idx++) {
        cells[idx].state = true;
      }
    }

    const guideLen = guide[guideIdx];

    // if start touching a blocker or edge, fill the rest
    if (!cells[start - 1] || cells[start - 1].state === false) {
      // fill len
      for (let idx = start; idx < start + guideLen; idx++) {
        cells[idx].state = true;
      }
      // stop
      if (cells[start + guideLen]) {
        cells[start + guideLen].state = false;
      }
    }

    // if end touching a blocker or edge, fill the rest
    if (!cells[end + 1] || cells[end + 1].state === false) {
      // fill len
      for (let idx = end; idx > end - guideLen; idx--) {
        cells[idx].state = true;
      }
      // stop
      if (cells[end - guideLen]) {
        cells[end - guideLen].state = false;
      }
    }
    const range = guidePossibleRanges[guideIdx];

    if (containsTrueWithinN(cells, range.start, range.guideVal)) {
      // find first true
      let start = -1;
      for (let idx = range.start;; idx++) {
        if (cells[idx].state === true) {
          start = idx;
          break;
        }
      }
      // cells[start].hilight2 = true;
      const fillLen = range.guideVal - (start - range.start);

      for (let offset = 0; offset < fillLen; offset++) {
        if (debug) {
          // console.log("waaaah", { guide });
          cells[start + offset].hilight2 = true;
        }
        // if (cells[start + offset].hilight2 === false) {
        //console.log("waaaaah", { guide });
        // }
        // else cells[start + offset].hilight = true;
        // cells[start + offset].state = true;
      }
    }

    //
  }

  // OLD BELOW

  /*if (
    firstStart > -1 && firstEnd > -1 && firstStart < firstPossibleStarts[1]
  ) {
    const len = firstEnd - firstStart + 1;
    const range = guide[0] - len;

    const earliestPossibleFirst = max(firstStart - range, 0);
    const latestPossibleEnd = min(firstEnd + range, cells.length - 1);

    // before
    for (let idx = 0; idx < earliestPossibleFirst; idx++) {
      cells[idx].state = false;
      cells[idx].hilight = true;
    }

    // after
    for (
      let idx = latestPossibleEnd + 1;
      idx < firstPossibleStarts[1];
      idx++
    ) {
      cells[idx].state = false;
      cells[idx].hilight = true;
    }
  }*/

  return cells;
};

export const solveNextToBlocked = (
  guide: number[],
  cells: Cell[],
): Cell[] => {
  let start = -1;
  let end = -1;

  let blockedCount = 0;
  let undefinedCount = 0;

  for (const [idx, c] of cells.entries()) {
    if (c.state === true && start < 0) {
      start = idx;
    }
    if (c.state === false && start >= 0 && end === -1) {
      end = idx;
      const plottedLen = end - start;

      const g = guide[0];

      const sub = idx - plottedLen - undefinedCount - blockedCount;

      if (plottedLen > g) {
        return cells;
      }

      if (idx - plottedLen > g) {
        return cells;
      }

      if (sub <= g) {
        // mark all until -g
        let i = 1;
        for (; i <= g; i++) {
          cells[idx - i].state = true;
        }
        if (cells[idx - i]) {
          cells[idx - i].state = false;
        }
      }
    }
    if (c.state === undefined) {
      start = -1;
      end = -1;
    }

    if (c.state === false) {
      blockedCount++;
    }
    if (c.state === undefined) {
      undefinedCount++;
    }
  }

  return cells;
};

export const solveNoSpace = (
  guide: number[],
  cells: Cell[],
): Cell[] => {
  let min = guide[0];
  for (const g of guide) {
    if (g < min) {
      min = g;
    }
  }
  let start = -1;
  for (const [idx, c] of cells.entries()) {
    if (
      c.state === undefined && (idx === 0 || cells[idx - 1].state === false)
    ) {
      if (start < 0) {
        start = idx;
      }
    }
    if (c.state === false) {
      if (start > -1) {
        const count = idx - start;
        if (count < min) {
          for (let i = start; i < idx; i++) {
            cells[i].state = false;
          }
        }
      }
      start = -1;
    }
    if (c.state === true) {
      start = -1;
    }
  }

  return cells;
};

export const solveMaxLength = (
  guide: number[],
  cells: Cell[],
): Cell[] => {
  let max = guide[0];
  for (const g of guide) {
    if (g > max) {
      max = g;
    }
  }

  let count = 0;
  for (const [idx, c] of cells.entries()) {
    if (c.state === true) {
      count++;
      if (count === max) {
        // mark start and end
        if (cells[idx + 1]) {
          cells[idx + 1].state = false;
        }
        if (cells[idx - max]) {
          cells[idx - max].state = false;
        }
      }
    }
    if (c.state === undefined || c.state === false) {
      count = 0;
    }
  }

  return cells;
};

const arrayEquals = (a: any, b: any): boolean => {
  return Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index]);
};

export const solveCompletedRow = (
  guide: number[],
  cells: Cell[],
): Cell[] => {
  const completed = [];
  let count = 0;
  for (const [idx, c] of cells.entries()) {
    if (
      ((idx === 0 || cells[idx - 1].state === false) || count > 0) &&
      c.state === true
    ) {
      count++;
    }

    if (c.state === false) {
      if (count > 0) {
        completed.push(count);
      }
      count = 0;
    }
    if (c.state === undefined) {
      count = 0;
    }
  }
  if (count > 0) {
    completed.push(count);
  }

  if (arrayEquals(completed, guide)) {
    for (const [idx, c] of cells.entries()) {
      if (c.state === undefined) {
        cells[idx].state = false;
      }
    }
  }

  return cells;
};

export const solveFirstNoFit = (
  guide: number[],
  cells: Cell[],
): Cell[] => {
  for (const [idx, c] of cells.entries()) {
    if (c.state === true) {
      break;
    }
    if (c.state === false) {
      if (idx < guide[0]) {
        for (let i = 0; i < idx; i++) {
          cells[i].state = false;
        }
      }

      break;
    }
  }

  return cells;
};

export const solveZero = (
  guide: number[],
  cells: Cell[],
): Cell[] => {
  if (arrayEquals(guide, [0])) {
    for (const [idx] of cells.entries()) {
      cells[idx].state = false;
    }
  }

  return cells;
};

export const solveStartGuideTouching = (
  guide: number[],
  cells: Cell[],
): Cell[] => {
  if (cells[guide[0]] && cells[guide[0]].state === true) {
    cells[0].state = false;
  }
  return cells;
};

const copyCells = (cells: Cell[]): Cell[] => {
  const res: Cell[] = [];
  for (const c of cells) {
    res.push({ state: c.state, hilight: c.hilight, hilight2: c.hilight2 });
  }
  return res;
};

const copyGuide = (guide: number[]): number[] => {
  const res: number[] = [];
  for (const g of guide) {
    res.push(g);
  }
  return res;
};

type Trim = {
  guideStart: number;
  cellsStart: number;
};

export const solve = (
  guideRows: number[][],
  guideCols: number[][],
): Cell[][] => {
  console.clear();

  const state: Cell[][] = [];

  // init full state
  for (let r = 0; r < guideRows.length; r++) {
    state[r] = [];
    for (let c = 0; c < guideCols.length; c++) {
      state[r][c] = { state: undefined };
    }
  }

  const funcs = [
    { fn: solveOverlaps, reverse: false },
    { fn: solveEdegs, reverse: true },
    { fn: solveMinimumEdge, reverse: true },
    { fn: solveOutOfReach, reverse: false },
    { fn: solveNextToBlocked, reverse: true },
    { fn: solveMaxLength, reverse: false },
    { fn: solveNoSpace, reverse: false },
    { fn: solveCompletedRow, reverse: true },
    { fn: solveFirstNoFit, reverse: true },
    { fn: solveZero, reverse: true },
    { fn: solveStartGuideTouching, reverse: true },
    { fn: solveOutOfReachWithSlidingStarts, reverse: true },
  ];

  type Updated = {
    error: boolean;
    count: number;
  };

  const updateRowState = (
    name: string,
    r: number,
    s: Cell[],
    trim: Trim,
    reversed = false,
  ): Updated => {
    let count = 0;

    for (const [idx, v] of s.entries()) {
      let c = idx + trim.cellsStart;
      if (reversed) {
        c = state[r].length - 1 - idx - trim.cellsStart;
      }

      if (v.state === true || v.state === false) {
        if (
          state[r][c].state !== v.state &&
          state[r][c].state !== undefined
        ) {
          console.error(
            `${name} row=${r} changed [${r}, ${c}] from ${
              state[r][c].state
            } to ${v.state}`,
          );
          state[r][c].hilight = true;
          return { error: true, count: 0 };
        }
        if (state[r][c].state === undefined) {
          count++;
        }
        state[r][c].state = v.state;
      }
      if (v.hilight === true) {
        state[r][c].hilight = true;
      }
      if (v.hilight2 === true) {
        state[r][c].hilight2 = true;
      }
    }

    return { error: false, count };
  };

  const updateColState = (
    name: string,
    c: number,
    s: Cell[],
    trim: Trim,
    reversed = false,
  ): Updated => {
    let count = 0;
    for (const [idx, v] of s.entries()) {
      let r = idx + trim.cellsStart;
      if (reversed) {
        r = state.length - 1 - idx - trim.cellsStart;
      }

      if (v.state === true || v.state === false) {
        if (state[r][c].state !== v.state && state[r][c].state !== undefined) {
          console.error(
            `${name} col=${c} changed [${r}, ${c}] from ${
              state[r][c].state
            } to ${v.state}`,
          );
          state[r][c].hilight = true;
          return { error: true, count: 0 };
        }
        if (state[r][c].state === undefined) {
          count++;
        }
        state[r][c].state = v.state;
      }
      if (v.hilight === true) {
        state[r][c].hilight = true;
      }

      if (v.hilight2 === true) {
        state[r][c].hilight2 = true;
      }
    }
    return { error: false, count };
  };

  for (let it = 0; it < 100; it++) {
    console.log("~~ITERATION~~");

    let updates = 0;

    // reset hilights
    for (let r = 0; r < guideRows.length; r++) {
      for (let c = 0; c < guideCols.length; c++) {
        state[r][c].hilight = undefined;
        state[r][c].hilight2 = undefined;
      }
    }

    // solve rows
    for (let r = 0; r < guideRows.length; r++) {
      for (const fn of funcs) {
        const guide = copyGuide(guideRows[r]);
        const cells = copyCells(state[r]);
        const trim = trimLeft(guide, cells);

        if (trim.cellsStart < cells.length - 1) {
          const s = fn.fn(
            guide.slice(trim.guideStart),
            cells.slice(trim.cellsStart),
          );
          const { error, count } = updateRowState(fn.fn.name, r, s, trim);
          if (error) {
            return state;
          }
          updates += count;
        }

        if (fn.reverse) {
          const reversedGuide = copyGuide(guideRows[r]).reverse();
          const reversedCells = copyCells(state[r]).reverse();
          const trim = trimLeft(reversedGuide, reversedCells);

          if (trim.cellsStart < cells.length - 1) {
            const s2 = fn.fn(
              reversedGuide.slice(trim.guideStart),
              reversedCells.slice(trim.cellsStart),
            );
            const { error, count } = updateRowState(
              fn.fn.name,
              r,
              copyCells(s2),
              trim,
              true,
            );
            if (error) {
              return state;
            }
            updates += count;
          }
        }
      }
    }

    // solve cols
    for (let c = 0; c < guideCols.length; c++) {
      for (const fn of funcs) {
        const cells = copyCells(state.map((row) => row[c]));
        const guide = copyGuide(guideCols[c]);
        const trim = trimLeft(guide, cells);

        if (trim.cellsStart < cells.length - 1) {
          const s = fn.fn(
            guide.slice(trim.guideStart),
            cells.slice(trim.cellsStart),
          );
          const { error, count } = updateColState(fn.fn.name, c, s, trim);
          if (error) {
            return state;
          }
          updates += count;
        }

        if (fn.reverse) {
          const reversedGuide = copyGuide(guideCols[c]).reverse();
          const reversedCells = copyCells(cells).reverse();
          const trim = trimLeft(reversedGuide, reversedCells);

          if (trim.cellsStart < cells.length - 1) {
            const s2 = fn.fn(
              reversedGuide.slice(trim.guideStart),
              reversedCells.slice(trim.cellsStart),
            );
            const { error, count } = updateColState(
              fn.fn.name,
              c,
              copyCells(s2),
              trim,
              true,
            );
            if (error) {
              return state;
            }
            updates += count;
          }
        }
      }
    }

    if (updates === 0) {
      console.log(`No changes after ${updates} iterations`);
      break;
    }
    console.log(updates);
  }

  return state;
};
