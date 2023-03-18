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

export const solveEdegs = (guide: number[], cells: Cell[]): Cell[] => {
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

export const trimLeft = (
	guide: number[],
	cells: Cell[]
): {
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
		cellsStart
	};
};

export const solveMinimumEdge = (guide: number[], cells: Cell[]): Cell[] => {
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
					end: idx - 1
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
			end: cells.length - 1
		});
	}
	return regions;
};

export const solveOutOfReach = (guide: number[], cells: Cell[]): Cell[] => {
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

const sum = (...nums: number[]): number => {
	let r = 0;
	for (const n of nums) {
		r += n;
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
				len: idx - start
			});
			start = -1;
		}
	}
	if (start > -1) {
		res.push({
			start: start,
			end: cells.length - 1,
			len: cells.length - start
		});
	}

	return res;
};

const containsBlockedWithinN = (cells: Cell[], start: number, n: number): boolean => {
	for (let offset = 0; offset < n; offset++) {
		if (cells[start + offset] && cells[start + offset].state === false) {
			return true;
		}
	}
	return false;
};

const containsTrueWithinN = (cells: Cell[], start: number, n: number): boolean => {
	for (let offset = 0; offset < n; offset++) {
		if (cells[start + offset] && cells[start + offset].state === true) {
			return true;
		}
	}
	return false;
};

export type GuideRange = Range & {
	guideIdx: number;
	guideVal: number;
};

const isDebug = (guide: number[]): boolean => {
	// rrayEquals(guide, [1, 6, 1, 1, 1, 1, 3, 2]) ||
	// arrayEquals(guide, [1, 10, 4]) ||
	// arrayEquals(guide, [4, 5, 5]) ||
	return arrayEquals(guide, [3, 6, 3, 6, 6]) || arrayEquals(guide, [3, 1, 1, 3]);
	false;
	// arrayEquals(guide, [1, 10, 4]) ||
	// arrayEquals(guide, [1, 10, 4]);
	// arrayEquals(guide, [3, 7, 11, 1]);
	//   arrayEquals(guide, [1, 11, 7, 3]);
	// return arrayEquals(guide, [1, 10, 4]);
};

export const getGuidePossibleRangesOneDirection = (
	guide: number[],
	cells: Cell[]
): GuideRange[] => {
	const groups = findGroups(cells);
	const guidePossibleRanges: GuideRange[] = [];

	const debug = isDebug(guide);

	for (const [idx, guideVal] of guide.entries()) {
		// adjust based on previous numbers, and it's own first possible basic start
		let start = max(0, ...guidePossibleRanges.map((r) => r.start + r.guideVal + 1));

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
		// if (debug) {
		// const startAt = groups.filter((g) => g.start === start);
		// if (startAt.length === 1 && startAt[0].len === guideVal) {
		//   end = startAt[0].end;
		// }
		// }

		do {
			let preIterationStart = start;

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

			while (true) {
				// not start on blocked
				if (cells[start] && cells[start].state === false) {
					start++;
					continue;
				}
				// not start directly after other block
				if (cells[start - 1] && cells[start - 1].state === true) {
					start++;
					continue;
				}
				break;
			}

			// if start is touching or a part of an existing, group that is bigger than guideVal, move start to after the group
			for (const g of groups) {
				console.log('touching?', { idx, start, g });
				if (g.start - 1 <= start && g.end + 1 >= start) {
					let hypotheticalLen = max(start, g.end) - min(start, g.start);
					console.log('touched!', { hypotheticalLen });
					if (hypotheticalLen > guideVal) {
						start = g.end + 2;
						console.log('THIS HAPPENED');
						break;
					}
				}
			}

			if (start === preIterationStart) {
				console.log('DONE', { idx, guideVal, start });
				break;
			} else {
				console.log('RUNNING AGAIN', { idx, guideVal, start });
			}
		} while (true);

		let end = cells.length - 1;

		// guide end must end before the cumulative sum of groups reaches guideVal
		// TODO: is there a legal way to run this for non-start guides?
		if (start === 0) {
			// now when we know where it starts.. find the end!
			const tooLargeGroups = groups.filter((g) => g.len && g.len > guideVal && g.start > start);
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

		while (true) {
			// not end on blocked
			if (cells[end] && cells[end].state === false) {
				end--;
				continue;
			}
			// not end directly before other block
			if (cells[end + 1] && cells[end + 1].state === true) {
				end--;
				continue;
			}
			break;
		}

		guidePossibleRanges.push({
			start,
			end,
			guideIdx: idx,
			guideVal: guideVal
		});
	}

	return guidePossibleRanges;
};

export const getGuidePossibleRanges = (guide: number[], cells: Cell[]): GuideRange[] => {
	const first = getGuidePossibleRangesOneDirection(guide, cells);

	// flip it, and get from the second direction
	const revGuide = copyGuide(guide).reverse();
	const revCells = copyCells(cells).reverse();
	const second = getGuidePossibleRangesOneDirection(revGuide, revCells).reverse();

	console.log('first', first);
	console.log('second', second);

	// adjust ends of first based on starts of second
	const combined = first.map((range, idx) => {
		const r = { ...range };
		const otherEnd = cells.length - second[idx].start - 1;
		r.end = min(r.end, otherEnd);

		const otherStart = cells.length - second[idx].end - 1;
		r.start = max(r.start, otherStart);

		return r;
	});

	console.log('combined', combined);

	const groups = findGroups(cells);

	// if there are groups that are only within one guide, adjust that guide to the group (plus surrounding)
	// TODO: Are we adjusting here???!
	const singleGuideGroups = detectSingleGuideGroups(groups, combined);

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

				const nStart = max(0, minGroupStart - delta);
				const nEnd = min(cells.length - 1, maxGroupEnd + delta);

				combined[idx] = {
					...guide,
					start: nStart,
					end: nEnd
				};
			}
		}
	}

	// adjust start
	for (const [idx, guide] of combined.entries()) {
		if (combined[idx - 1]) {
			combined[idx].start = max(combined[idx - 1].start + 2, guide.start);
		}
	}

	// adjust ends
	for (let idx = combined.length - 1; idx >= 0; idx--) {
		if (combined[idx + 1]) {
			combined[idx].end = min(combined[idx + 1].end - 2, combined[idx].end);
		}
	}

	// TODO! after start and end have been adjusted, apply same rules as in getGuidePossibleRangesOneDirection for moving them

	// set len of all ranges
	for (const [idx, guide] of combined.entries()) {
		combined[idx].len = guide.end - guide.start + 1;
	}

	return combined;
};

const detectSingleGuideGroups = (
	groups: Range[],
	guidePossibleRanges: GuideRange[]
): Record<number, Range[]> => {
	const singleGuideGroups: Record<number, Range[]> = {};

	// groups that can only be in one guide
	// group == marked cells
	// guide == numbers
	for (const g of groups) {
		const groupPossibleGuides = guidePossibleRanges.filter((r) => {
			const len = g.end - g.start + 1;
			return r.start <= g.start && r.end >= g.end && r.guideVal >= len;
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

export const solveOutOfReachWithSlidingStarts = (guide: number[], cells: Cell[]): Cell[] => {
	const groups = findGroups(cells);

	if (groups.length === 0) {
		return cells;
	}

	const guidePossibleRanges = getGuidePossibleRanges(guide, cells);

	const singleGuideGroups = detectSingleGuideGroups(groups, guidePossibleRanges);

	// Cells with no overlapping range
	for (const [idx, c] of cells.entries()) {
		const ranges = guidePossibleRanges.filter((r) => r.start <= idx && r.end >= idx);
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
			// cells[start].hilight = true;
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

export const solveNextToBlocked = (guide: number[], cells: Cell[]): Cell[] => {
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

export const solveNoSpace = (guide: number[], cells: Cell[]): Cell[] => {
	let min = guide[0];
	for (const g of guide) {
		if (g < min) {
			min = g;
		}
	}
	let start = -1;
	for (const [idx, c] of cells.entries()) {
		if (c.state === undefined && (idx === 0 || cells[idx - 1].state === false)) {
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

const arrayEquals = (a: any, b: any): boolean => {
	return (
		Array.isArray(a) &&
		Array.isArray(b) &&
		a.length === b.length &&
		a.every((val, index) => val === b[index])
	);
};

export const solveCompletedRow = (guide: number[], cells: Cell[]): Cell[] => {
	const completed = [];
	let count = 0;
	for (const [idx, c] of cells.entries()) {
		if ((idx === 0 || cells[idx - 1].state === false || count > 0) && c.state === true) {
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

export const solveFirstNoFit = (guide: number[], cells: Cell[]): Cell[] => {
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

export const solveZero = (guide: number[], cells: Cell[]): Cell[] => {
	if (arrayEquals(guide, [0])) {
		for (const [idx] of cells.entries()) {
			cells[idx].state = false;
		}
	}

	return cells;
};

export const solveStartGuideTouching = (guide: number[], cells: Cell[]): Cell[] => {
	if (cells[guide[0]] && cells[guide[0]].state === true) {
		cells[0].state = false;
	}
	return cells;
};

const solveOverlapsSlidingRanges = (guide: number[], cells: Cell[]): Cell[] => {
	// guide ranges that doesn't overlap with other guide ranges
	const ranges = getGuidePossibleRanges(guide, cells);

	for (const [idx, r] of ranges.entries()) {
		const overlapping = ranges.filter((other, otherIdx) => {
			return other.start <= r.end && other.end >= r.start && idx !== otherIdx;
		});

		if (overlapping.length > 0) {
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

type Trim = {
	guideStart: number;
	cellsStart: number;
};

type SolveResult = {
	cells: Cell[][];
	iterations: number;
};

export const solve = (
	guideRows: number[][],
	guideCols: number[][],
	maxIterations: number = 100,
	highlightChanges: boolean = false
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
		{ fn: solveOverlapsBasic, reverse: false },
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
		{ fn: solveOverlapsSlidingRanges, reverse: false }
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
		reversed = false
	): Updated => {
		let count = 0;

		for (const [idx, v] of s.entries()) {
			let c = idx + trim.cellsStart;
			if (reversed) {
				c = state[r].length - 1 - idx - trim.cellsStart;
			}

			if (v.state === true || v.state === false) {
				if (state[r][c].state !== v.state && state[r][c].state !== undefined) {
					console.error(
						`${name} row=${r} changed [${r}, ${c}] from ${state[r][c].state} to ${v.state}`
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

	const updateColState = (
		name: string,
		c: number,
		s: Cell[],
		trim: Trim,
		reversed = false
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
						`${name} col=${c} changed [${r}, ${c}] from ${state[r][c].state} to ${v.state}`
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
		console.log('~~ITERATION~~');

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
				const trim = trimLeft(guide, cells);

				if (trim.cellsStart < cells.length - 1) {
					const s = fn.fn(guide.slice(trim.guideStart), cells.slice(trim.cellsStart));
					const { error, count } = updateRowState(fn.fn.name, r, s, trim);
					if (error) {
						return { cells: state, iterations: it };
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
							reversedCells.slice(trim.cellsStart)
						);
						const { error, count } = updateRowState(fn.fn.name, r, copyCells(s2), trim, true);
						if (error) {
							return { cells: state, iterations: it };
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
					const s = fn.fn(guide.slice(trim.guideStart), cells.slice(trim.cellsStart));
					const { error, count } = updateColState(fn.fn.name, c, s, trim);
					if (error) {
						return { cells: state, iterations: it };
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
							reversedCells.slice(trim.cellsStart)
						);
						const { error, count } = updateColState(fn.fn.name, c, copyCells(s2), trim, true);
						if (error) {
							return { cells: state, iterations: it };
						}
						updates += count;
					}
				}
			}
		}

		if (updates === 0) {
			console.log(`No changes after ${it} iterations`);
			return { cells: state, iterations: it };
			// break;
		}
		console.log(updates);
	}

	return { cells: state, iterations: -1 };
};
