/**
 * 35. Insert Interval
 * LeetCode #57 | Difficulty: Medium | Category: Interval
 *
 * Problem
 * -------
 * Given a set of non-overlapping intervals `intervals` sorted by start
 * time, insert a new interval `newInterval` into the list (merging if
 * necessary so intervals remain sorted and non-overlapping).
 *
 * Example
 * -------
 * Input: intervals = [[1,3],[6,9]], newInterval = [2,5]
 * Output: [[1,5],[6,9]]
 *
 * Constraints
 * -----------
 * 0 <= intervals.length <= 10^4
 *
 * Approaches
 * ----------
 * 1. Brute force (`insertBruteForce`) - Append newInterval, re-sort
 *    everything, and merge. Ignores the pre-sorted input. O(n log n) time,
 *    O(n) space.
 * 2. Better (`insertBetter`) - Binary search for the insertion point by start
 *    time, splice newInterval in so the list stays sorted, then do one merge
 *    pass. O(n) time (the splice and merge dominate the O(log n) search), O(n)
 *    space.
 * 3. Optimal (`insertOptimal`) - Single linear pass: copy intervals ending
 *    before newInterval starts, absorb every overlapping interval into
 *    newInterval, then copy the rest. O(n) time, O(n) space.
 */
import assert from "node:assert/strict";

/** Merge a list of intervals already sorted by start. */
function mergeSorted(intervals: number[][]): number[][] {
  const merged: number[][] = [];
  for (const [start, end] of intervals) {
    const last = merged[merged.length - 1];
    if (last && start <= last[1]) last[1] = Math.max(last[1], end);
    else merged.push([start, end]);
  }
  return merged;
}

/** Append newInterval, re-sort everything, and merge. Ignores the pre-sorted input. O(n log n) time, O(n) space. */
export function insertBruteForce(intervals: number[][], newInterval: number[]): number[][] {
  const all = [...intervals, newInterval].sort((a, b) => a[0] - b[0]);
  return mergeSorted(all);
}

/**
 * Binary search for the insertion point by start time, splice newInterval
 * in so the list stays sorted, then do one merge pass.
 * O(n) time (the splice and merge dominate the O(log n) search), O(n) space.
 */
export function insertBetter(intervals: number[][], newInterval: number[]): number[][] {
  let lo = 0;
  let hi = intervals.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (intervals[mid][0] < newInterval[0]) lo = mid + 1;
    else hi = mid;
  }
  const all = [...intervals.slice(0, lo), newInterval, ...intervals.slice(lo)];
  return mergeSorted(all);
}

/**
 * Single linear pass: copy intervals ending before newInterval starts,
 * absorb every overlapping interval into newInterval, then copy the rest.
 * O(n) time, O(n) space.
 */
export function insertOptimal(intervals: number[][], newInterval: number[]): number[][] {
  const result: number[][] = [];
  let [start, end] = newInterval;
  let i = 0;
  const n = intervals.length;
  while (i < n && intervals[i][1] < start) result.push(intervals[i++]);
  while (i < n && intervals[i][0] <= end) {
    start = Math.min(start, intervals[i][0]);
    end = Math.max(end, intervals[i][1]);
    i++;
  }
  result.push([start, end]);
  while (i < n) result.push(intervals[i++]);
  return result;
}

if (import.meta.main) {
  const tests: [number[][], number[], number[][]][] = [
    [[[1, 3], [6, 9]], [2, 5], [[1, 5], [6, 9]]],
    [[[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8], [[1, 2], [3, 10], [12, 16]]],
    [[], [5, 7], [[5, 7]]],
    [[[1, 5]], [2, 3], [[1, 5]]],
    [[[1, 5]], [6, 8], [[1, 5], [6, 8]]],
  ];
  for (const [intervals, newInterval, expected] of tests) {
    for (const fn of [insertBruteForce, insertBetter, insertOptimal]) {
      const result = fn(intervals.map((iv) => [...iv]), [...newInterval]);
      assert.deepEqual(result, expected, `${fn.name}(${JSON.stringify(intervals)}, ${JSON.stringify(newInterval)})`);
    }
  }
  console.log("All Insert Interval tests passed.");
}
