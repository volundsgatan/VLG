export type Cell = {
  state: boolean | undefined;
  hilight?: boolean;
  hilightGreen?: boolean;
  hilightRed?: boolean;
};

export const solveOverlapsBasic = (guide: number[], cells: Cell[]): Cell[] => {
  const left = Array(cells.length);

  // from left
  let pos = 0;
  for (const [idx, g] of guide.entries()) {
    // if already blocked, skip
    while (cells[pos] && cells[pos].state === false) {
      pos++;
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
    while (cells[pos] && cells[pos].state === false) {
      pos--;
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

// groups that are separated by false blocks, that never could become the same group
const findStrictlySeparatedGroups = (cells: Cell[]): Range[] => {
  const res = [];

  for (let idx = 0; idx < cells.length; idx++) {
    if (cells[idx].state === true) {
      let start = idx;

      while (true) {
        if (!cells[start - 1] || cells[start - 1].state === false) {
          break;
        }
        start--;
      }

      let end = idx;
      while (true) {
        if (!cells[end + 1] || cells[end + 1].state === false) {
          break;
        }
        end++;
      }

      res.push({ start, end });

      idx = end + 1;
    }
  }

  return res;
};

const containsBlockedWithinN = (
  cells: Cell[],
  start: number,
  n: number,
): boolean => {
  for (let offset = 0; offset < n; offset++) {
    if (cells[start + offset] && cells[start + offset].state === false) {
      return true;
    }
  }
  return false;
};

export type GuideRange = Range & {
  guideIdx: number;
  guideVal: number;
};

const moveStart = (
  start: number,
  guideIdx: number,
  guideVal: number,
  guide: number[],
  cells: Cell[],
): number => {
  const groups = findGroups(cells);
  do {
    const preIterationStart = start;

    // fix guide positions based on already solved blocks
    const groupsAfterStart = groups.filter((g) => g.start >= start);
    const guidesAfterCurrent = guide.slice(guideIdx + 1);
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
    while (containsBlockedWithinN(cells, start, guideVal)) {
      start++;
    }

    // not start on blocked
    while (cells[start] && cells[start].state === false) {
      start++;
    }

    // not start directly after other block
    while (cells[start - 1] && cells[start - 1].state === true) {
      start++;
    }

    // if start is touching or a part of an existing, group that is bigger than guideVal, move start to after the group
    for (const g of groups) {
      if (g.start - 1 <= start && g.end + 1 >= start) {
        const hypotheticalLen = max(start, g.end) - min(start, g.start);
        if (hypotheticalLen > guideVal) {
          start = g.end + 2;
          break;
        }
      }
    }

    // not enough guides to fit separated groups
    // TODO: could possibly take size in to account, but seems to work well enough for now!
    const strictGroups = findStrictlySeparatedGroups(cells)
      .map((r) => {
        return { ...r, len: r.end - r.start + 1 };
      })
      .filter((r) => r.start > start);

    const guidesAfter = guide.slice(guideIdx + 1);
    if (guidesAfter.length < strictGroups.length) {
      start++;
    }

    if (start === preIterationStart) {
      return start;
    }
  } while (true);
};

const moveEnd = (end: number, cells: Cell[]): number => {
  do {
    const preIterationEnd = end;

    // not end on blocked
    while (cells[end] && cells[end].state === false) {
      end--;
    }

    // not end directly before other block
    while (cells[end + 1] && cells[end + 1].state === true) {
      end--;
    }

    if (end === preIterationEnd) {
      return end;
    }
  } while (true);
};

export const getGuidePossibleRangesOneDirection = (
  guide: number[],
  cells: Cell[],
): GuideRange[] => {
  const guidePossibleRanges: GuideRange[] = [];
  const groups = findGroups(cells);

  for (const [idx, guideVal] of guide.entries()) {
    // adjust based on previous numbers, and it's own first possible basic start
    let start = max(
      0,
      ...guidePossibleRanges.map((r) => r.start + r.guideVal + 1),
    );

    // if guide does not fit after start, push start forwards
    // can not contain any blocked cells within guideSize cells
    while (containsBlockedWithinN(cells, start, guideVal)) {
      start++;
    }

    start = moveStart(start, idx, guideVal, guide, cells);

    let end = cells.length - 1;

    // guide end must end before the cumulative sum of groups reaches guideVal
    // TODO: is there a legal way to run this for non-start guides?
    if (start === 0) {
      // now when we know where it starts.. find the end!
      const tooLargeGroups = groups.filter((g) =>
        g.len && g.len > guideVal && g.start > start
      );
      // guide range must end before the too large group
      if (tooLargeGroups.length > 0) {
        end = tooLargeGroups[0].start - 2;
      }

      let cumSum = 0;
      for (const g of groups) {
        if (g.len && g.start >= start) {
          if (cumSum + g.len > guideVal) {
            end = g.start - 1;
            break;
          }
          cumSum += g.len;
        }
      }
    }

    end = moveEnd(end, cells);

    guidePossibleRanges.push({
      start,
      end,
      guideIdx: idx,
      guideVal: guideVal,
    });
  }

  return guidePossibleRanges;
};

export const getGuidePossibleRanges = (
  guide: number[],
  cells: Cell[],
): GuideRange[] => {
  const first = getGuidePossibleRangesOneDirection(guide, cells);

  // flip it, and get from the second direction
  const revGuide = copyGuide(guide).reverse();
  const revCells = copyCells(cells).reverse();
  const second = getGuidePossibleRangesOneDirection(revGuide, revCells)
    .reverse();

  // adjust ends of first based on starts of second
  const combined = first.map((range, idx) => {
    const r = { ...range };
    const otherEnd = cells.length - second[idx].start - 1;
    r.end = min(r.end, otherEnd);

    const otherStart = cells.length - second[idx].end - 1;
    r.start = max(r.start, otherStart);

    return r;
  });

  const groups = findGroups(cells);

  for (let it = 0; it < 100; it++) {
    const preCombined = JSON.stringify(combined);

    // if there are groups that are only within one guide, adjust that guide to the group (plus surrounding)
    const singleGuideGroups = detectSingleGuideGroups(groups, combined, cells);

    for (const [idx, guide] of combined.entries()) {
      if (singleGuideGroups[idx]) {
        const groups = singleGuideGroups[idx];

        if (groups) {
          const minGroupStart = min(...groups.map((g) => g.start));
          const maxGroupEnd = max(...groups.map((g) => g.end));

          const singleGroupLen = maxGroupEnd - minGroupStart + 1;

          let delta = 0;
          if (singleGroupLen < guide.guideVal) {
            delta = guide.guideVal - singleGroupLen;
          }

          const nStart = max(0, minGroupStart - delta, guide.start);
          const nEnd = min(cells.length - 1, maxGroupEnd + delta, guide.end);

          combined[idx] = {
            ...guide,
            start: nStart,
            end: nEnd,
          };
        }
      }
    }

    // adjust start
    for (const [idx, guide] of combined.entries()) {
      if (combined[idx - 1]) {
        combined[idx].start = max(
          combined[idx - 1].start + combined[idx - 1].guideVal + 1,
          guide.start,
        );
      }
    }

    // adjust ends
    for (let idx = combined.length - 1; idx >= 0; idx--) {
      if (combined[idx + 1]) {
        combined[idx].end = min(combined[idx + 1].end - 2, combined[idx].end);
      }
    }

    // after start and end have been adjusted, apply same rules as in getGuidePossibleRangesOneDirection for moving them
    for (const [idx, range] of combined.entries()) {
      combined[idx].start = moveStart(
        range.start,
        idx,
        range.guideVal,
        guide,
        cells,
      );
      combined[idx].end = moveEnd(range.end, cells);
    }

    // set len of all ranges
    for (const [idx, guide] of combined.entries()) {
      combined[idx].len = guide.end - guide.start + 1;
    }

    // no changes
    const postCombined = JSON.stringify(combined);
    if (postCombined === preCombined) {
      break;
    }
  }

  return combined;
};

const groupPossibleSizesMemo: Map<string, Set<number>> = new Map();

export const groupPossibleSizes = (
  start: number,
  end: number,
  cells: Cell[],
): Set<number> => {
  const key = JSON.stringify({ start, end, cells });

  const fromCache = groupPossibleSizesMemo.get(key);
  if (fromCache) {
    return fromCache;
  }

  // absorb to the left if true
  while (cells[start - 1] && cells[start - 1].state === true) {
    start--;
  }

  // absorb to the right if true
  while (cells[end + 1] && cells[end + 1].state === true) {
    end++;
  }

  const len = end - start + 1;

  const res = new Set([len]);

  // if not blocked to left
  if (cells[start - 1] && cells[start - 1].state !== false) {
    groupPossibleSizes(start - 1, end, cells).forEach((v) => {
      res.add(v);
    });
  }

  // if not blocked to right
  if (cells[end + 1] && cells[end + 1].state !== false) {
    groupPossibleSizes(start, end + 1, cells).forEach((v) => res.add(v));
  }

  groupPossibleSizesMemo.set(key, res);

  return res;
};

const detectSingleGuideGroups = (
  groups: Range[],
  guidePossibleRanges: GuideRange[],
  cells: Cell[],
): Record<number, Range[]> => {
  const singleGuideGroups: Record<number, Range[]> = {};

  // groups that can only be in one guide
  // group == marked cells
  // guide == numbers
  for (const g of groups) {
    const groupPossibleGuides = guidePossibleRanges.filter((r) => {
      const len = g.end - g.start + 1;
      return (
        r.start <= g.start &&
        r.end >= g.end &&
        r.guideVal >= len &&
        groupPossibleSizes(g.start, g.end, cells).has(r.guideVal)
      );
    });

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

  const guidePossibleRanges = getGuidePossibleRanges(guide, cells);

  const singleGuideGroups = detectSingleGuideGroups(
    groups,
    guidePossibleRanges,
    cells,
  );

  // Cells with no overlapping range
  for (const [idx] of cells.entries()) {
    const ranges = guidePossibleRanges.filter((r) =>
      r.start <= idx && r.end >= idx
    );
    if (ranges.length === 0) {
      cells[idx].state = false;
    }
  }

  // TODO: Is the thing below even used?

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

    const guideLen = guide[parseInt(guideIdx)];

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
  }

  return cells;
};

export const solveMaxLength = (guide: number[], cells: Cell[]): Cell[] => {
  const guideRanges = getGuidePossibleRanges(guide, cells);
  const groups = findGroups(cells);

  for (const g of groups) {
    // all ranges that overlap with this group
    const overlappingGuideVal = guideRanges
      .filter((r) => {
        return r.start <= g.start && r.end >= g.end;
      })
      .map((g) => g.guideVal || 0);

    const maxLen = max(...overlappingGuideVal);

    if (g.len && g.len === maxLen) {
      // is done, wrap with edges
      if (cells[g.start - 1]) {
        cells[g.start - 1].state = false;
      }
      if (cells[g.end + 1]) {
        cells[g.end + 1].state = false;
      }
    }
  }

  return cells;
};

const arrayEquals = (a: unknown, b: unknown): boolean => {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
};

export const solveZero = (guide: number[], cells: Cell[]): Cell[] => {
  if (arrayEquals(guide, [0])) {
    for (const [idx] of cells.entries()) {
      cells[idx].state = false;
    }
  }

  return cells;
};

export const solveOverlapsSlidingRanges = (
  guide: number[],
  cells: Cell[],
): Cell[] => {
  // guide ranges that doesn't overlap with other guide ranges
  const ranges = getGuidePossibleRanges(guide, cells);

  for (const [idx, r] of ranges.entries()) {
    const overlapping = ranges.filter((other, otherIdx) => {
      return other.start <= r.end && other.end >= r.start && idx !== otherIdx;
    });

    if (overlapping.length > 0) {
      continue;
    }

    if (r.guideVal === 0) {
      continue;
    }

    const end = r.start + r.guideVal - 1;
    const start = r.end - r.guideVal + 1;

    if (end >= start) {
      for (let i = start; i <= end; i++) {
        if (cells[i]) {
          cells[i].state = true;
        }
      }
    }
  }

  return cells;
};

const copyCells = (cells: Cell[]): Cell[] => {
  const res: Cell[] = [];
  for (const c of cells) {
    res.push({ ...c });
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

type SolveResult = {
  cells: Cell[][];
  iterations: number;
};

export const solve = (
  guideRows: number[][],
  guideCols: number[][],
  maxIterations = 100,
  highlightChanges = false,
): SolveResult => {
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
    { fn: solveOverlapsBasic },
    { fn: solveMaxLength },
    { fn: solveZero },
    { fn: solveOutOfReachWithSlidingStarts },
    { fn: solveOverlapsSlidingRanges },
  ];

  type Updated = {
    error: boolean;
    count: number;
  };

  const updateRowState = (name: string, r: number, s: Cell[]): Updated => {
    let count = 0;

    for (const [c, v] of s.entries()) {
      if (v.state === true || v.state === false) {
        if (state[r][c].state !== v.state && state[r][c].state !== undefined) {
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
          if (highlightChanges) {
            state[r][c].hilight = true;
          }
        }
        state[r][c].state = v.state;
      }
      if (v.hilight === true) {
        state[r][c].hilight = true;
      }
      if (v.hilightRed === true) {
        state[r][c].hilightRed = true;
      }
      if (v.hilightGreen === true) {
        state[r][c].hilightGreen = true;
      }
    }

    return { error: false, count };
  };

  const updateColState = (name: string, c: number, s: Cell[]): Updated => {
    let count = 0;
    for (const [r, v] of s.entries()) {
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
          if (highlightChanges) {
            state[r][c].hilight = true;
          }
        }
        state[r][c].state = v.state;
      }
      if (v.hilight === true) {
        state[r][c].hilight = true;
      }

      if (v.hilightRed === true) {
        state[r][c].hilightRed = true;
      }
      if (v.hilightGreen === true) {
        state[r][c].hilightGreen = true;
      }
    }
    return { error: false, count };
  };

  for (let it = 0; it < maxIterations; it++) {
    let updates = 0;

    // reset hilights
    for (let r = 0; r < guideRows.length; r++) {
      for (let c = 0; c < guideCols.length; c++) {
        state[r][c].hilight = undefined;
        state[r][c].hilightRed = undefined;
        state[r][c].hilightGreen = undefined;
      }
    }

    // solve rows
    for (let r = 0; r < guideRows.length; r++) {
      for (const fn of funcs) {
        const guide = copyGuide(guideRows[r]);
        const cells = copyCells(state[r]);

        const s = fn.fn(guide, cells);
        const { error, count } = updateRowState(fn.fn.name, r, s);
        if (error) {
          return { cells: state, iterations: it };
        }
        updates += count;
      }
    }

    // solve cols
    for (let c = 0; c < guideCols.length; c++) {
      for (const fn of funcs) {
        const cells = copyCells(state.map((row) => row[c]));
        const guide = copyGuide(guideCols[c]);

        const s = fn.fn(guide, cells);
        const { error, count } = updateColState(fn.fn.name, c, s);
        if (error) {
          return { cells: state, iterations: it };
        }
        updates += count;
      }
    }

    if (updates === 0) {
      return { cells: state, iterations: it };
    }
  }

  return { cells: state, iterations: -1 };
};
