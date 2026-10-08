/**
 * 36. Merge Intervals
 * LeetCode #56 | Difficulty: Medium | Category: Interval
 *
 * Problem
 * -------
 * Given an array of intervals, merge all overlapping intervals and return
 * an array of the non-overlapping intervals that cover all the intervals
 * in the input.
 *
 * Example
 * -------
 * Input: intervals = [[1,3],[2,6],[8,10],[15,18]]
 * Output: [[1,6],[8,10],[15,18]]
 *
 * Constraints
 * -----------
 * 1 <= intervals.length <= 10^4
 *
 * Approaches
 * ----------
 * 1. Brute force (`mergeBruteForce`) - Repeatedly scan all pairs and merge any
 *    two overlapping intervals, until a full scan finds no overlap. Sort only
 *    for the final output order. O(n^3) time, O(n) space.
 * 2. Better (`mergeBetter`) - Sort by start, then merge in place using an
 *    explicit write index `k` (the last merged interval lives at
 *    intervals[k]); truncate at the end. O(n log n) time, O(1) extra space
 *    besides sorting.
 * 3. Optimal (`mergeOptimal`) - Sort by start; extend the last merged interval
 *    whenever the next one overlaps it. O(n log n) time, O(n) space.
 */
import assert from "node:assert/strict";

/**
 * Repeatedly scan all pairs and merge any two overlapping intervals, until
 * a full scan finds no overlap. Sort only for the final output order.
 * O(n^3) time, O(n) space.
 */
export function mergeBruteForce(intervals: number[][]): number[][] {
  const list = intervals.map((iv) => [...iv]);
  let changed = true;
  while (changed) {
    changed = false;
    outer: for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        if (list[i][0] <= list[j][1] && list[j][0] <= list[i][1]) {
          list[i] = [Math.min(list[i][0], list[j][0]), Math.max(list[i][1], list[j][1])];
          list.splice(j, 1);
          changed = true;
          break outer;
        }
      }
    }
  }
  return list.sort((a, b) => a[0] - b[0]);
}

/**
 * Sort by start, then merge in place using an explicit write index `k`
 * (the last merged interval lives at intervals[k]); truncate at the end.
 * O(n log n) time, O(1) extra space besides sorting.
 */
export function mergeBetter(intervals: number[][]): number[][] {
  intervals.sort((a, b) => a[0] - b[0]);
  let k = 0;
  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] <= intervals[k][1]) {
      intervals[k][1] = Math.max(intervals[k][1], intervals[i][1]);
    } else {
      intervals[++k] = intervals[i];
    }
  }
  intervals.length = Math.min(intervals.length, k + 1);
  return intervals;
}

/** Sort by start; extend the last merged interval whenever the next one overlaps it. O(n log n) time, O(n) space. */
export function mergeOptimal(intervals: number[][]): number[][] {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const merged: number[][] = [];
  for (const [start, end] of sorted) {
    const last = merged[merged.length - 1];
    if (last && start <= last[1]) last[1] = Math.max(last[1], end);
    else merged.push([start, end]);
  }
  return merged;
}

if (import.meta.main) {
  const tests: [number[][], number[][]][] = [
    [[[1, 3], [2, 6], [8, 10], [15, 18]], [[1, 6], [8, 10], [15, 18]]],
    [[[1, 4], [4, 5]], [[1, 5]]],
    [[[1, 4], [0, 4]], [[0, 4]]],
    [[[1, 4], [2, 3]], [[1, 4]]],
    [[[2, 3], [4, 5], [6, 7], [1, 10]], [[1, 10]]],
  ];
  for (const [intervals, expected] of tests) {
    for (const fn of [mergeBruteForce, mergeBetter, mergeOptimal]) {
      assert.deepEqual(fn(intervals.map((iv) => [...iv])), expected, `${fn.name}(${JSON.stringify(intervals)})`);
    }
  }
  console.log("All Merge Intervals tests passed.");
}
