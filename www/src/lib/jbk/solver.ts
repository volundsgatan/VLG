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

export const solveOutOfReach = (
  guide: number[],
  cells: Cell[],
): Cell[] => {
  let first: number | undefined;

  // TODO: support for more then 1 guides
  if (guide.length === 1) {
    for (const [idx, c] of cells.entries()) {
      if (first === undefined && c.state === true) {
        first = idx;
      }
    }

    const g = guide[0];

    for (const [idx] of cells.entries()) {
      if (first !== undefined) {
        if (idx <= (first - g)) {
          cells[idx].state = false;
        }
      }
    }
  }

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
    { fn: solveOutOfReach, reverse: true },
    { fn: solveNextToBlocked, reverse: true },
    { fn: solveMaxLength, reverse: false },
    { fn: solveNoSpace, reverse: false },
    { fn: solveCompletedRow, reverse: true },
    { fn: solveFirstNoFit, reverse: true },
  ];

  const updateRowState = (
    name: string,
    r: number,
    s: Cell[],
    trim: Trim,
    reversed = false,
  ) => {
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
            `${name} changed [${r}, ${c}] from ${
              state[r][c].state
            } to ${v.state}`,
          );
          state[r][c].hilight = true;
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
  };

  const updateColState = (
    name: string,
    c: number,
    s: Cell[],
    trim: Trim,
    reversed = false,
  ) => {
    for (const [idx, v] of s.entries()) {
      let r = idx + trim.cellsStart;
      if (reversed) {
        r = state.length - 1 - idx - trim.cellsStart;
      }

      if (v.state === true || v.state === false) {
        if (state[r][c].state !== v.state && state[r][c].state !== undefined) {
          console.error(
            `${name} changed [${r}, ${c}] from ${
              state[r][c].state
            } to ${v.state}`,
          );
          state[r][c].hilight = true;
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

  // solve 10 times?
  for (let it = 0; it < 10; it++) {
    console.log("~~ITERATION~~");

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
          updateRowState(fn.fn.name, r, s, trim);
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
            updateRowState(fn.fn.name, r, copyCells(s2), trim, true);
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
          updateColState(fn.fn.name, c, s, trim);
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
            updateColState(fn.fn.name, c, copyCells(s2), trim, true);
          }
        }
      }
    }
  }

  return state;
};
