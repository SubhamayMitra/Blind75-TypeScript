/**
 * 37. Non-overlapping Intervals
 * LeetCode #435 | Difficulty: Medium | Category: Interval / Greedy
 *
 * Problem
 * -------
 * Given an array of intervals, return the minimum number of intervals you
 * need to remove to make the rest of the intervals non-overlapping.
 *
 * Example
 * -------
 * Input: intervals = [[1,2],[2,3],[3,4],[1,3]]
 * Output: 1           // remove [1,3]
 *
 * Constraints
 * -----------
 * 1 <= intervals.length <= 10^5
 *
 * Approaches
 * ----------
 * 1. Brute force (`eraseOverlapBruteForce`) - Try every subset (bitmask), keep
 *    those that are pairwise non-overlapping, and find the largest. Answer = n
 *    - largest subset size. O(2^n * n log n) time, O(n) space. Only feasible
 *    for tiny inputs.
 * 2. Better (`eraseOverlapBetter`) - Sort by start; dp[i] = most non-
 *    overlapping intervals in a chain ending with interval i (LIS-style).
 *    O(n^2) time, O(n) space.
 * 3. Optimal (`eraseOverlapOptimal`) - Activity-selection greedy: sort by END;
 *    keep an interval if it starts at or after the last kept end, otherwise
 *    remove it. O(n log n) time, O(1) extra space besides sorting.
 */
import assert from "node:assert/strict";

/**
 * Try every subset (bitmask), keep those that are pairwise non-overlapping,
 * and find the largest. Answer = n - largest subset size.
 * O(2^n * n log n) time, O(n) space. Only feasible for tiny inputs.
 */
export function eraseOverlapBruteForce(intervals: number[][]): number {
  const n = intervals.length;
  let bestKept = 0;
  for (let mask = 0; mask < 1 << n; mask++) {
    const chosen = intervals.filter((_, i) => mask & (1 << i)).sort((a, b) => a[0] - b[0]);
    let ok = true;
    for (let i = 1; i < chosen.length && ok; i++) ok = chosen[i][0] >= chosen[i - 1][1];
    if (ok) bestKept = Math.max(bestKept, chosen.length);
  }
  return n - bestKept;
}

/**
 * Sort by start; dp[i] = most non-overlapping intervals in a chain ending
 * with interval i (LIS-style). O(n^2) time, O(n) space.
 */
export function eraseOverlapBetter(intervals: number[][]): number {
  const n = intervals.length;
  if (n === 0) return 0;
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const dp: number[] = new Array(n).fill(1);
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (sorted[j][1] <= sorted[i][0]) dp[i] = Math.max(dp[i], dp[j] + 1);
    }
  }
  return n - Math.max(...dp);
}

/**
 * Activity-selection greedy: sort by END; keep an interval if it starts at
 * or after the last kept end, otherwise remove it.
 * O(n log n) time, O(1) extra space besides sorting.
 */
export function eraseOverlapOptimal(intervals: number[][]): number {
  const sorted = [...intervals].sort((a, b) => a[1] - b[1]);
  let removed = 0;
  let lastEnd = -Infinity;
  for (const [start, end] of sorted) {
    if (start >= lastEnd) lastEnd = end;
    else removed++;
  }
  return removed;
}

if (import.meta.main) {
  const tests: [number[][], number][] = [
    [[[1, 2], [2, 3], [3, 4], [1, 3]], 1],
    [[[1, 2], [1, 2], [1, 2]], 2],
    [[[1, 2], [2, 3]], 0],
    [[[1, 100], [11, 22], [1, 11], [2, 12]], 2],
  ];
  for (const [intervals, expected] of tests) {
    for (const fn of [eraseOverlapBruteForce, eraseOverlapBetter, eraseOverlapOptimal]) {
      assert.equal(fn(intervals.map((iv) => [...iv])), expected, `${fn.name}(${JSON.stringify(intervals)})`);
    }
  }
  console.log("All Non-overlapping Intervals tests passed.");
}
