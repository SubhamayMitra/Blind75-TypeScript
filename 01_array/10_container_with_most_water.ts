/**
 * 10. Container With Most Water
 * LeetCode #11 | Difficulty: Medium | Category: Array
 *
 * Problem
 * -------
 * Given n non-negative integers `height` where each represents a vertical
 * line at position i, find two lines that, together with the x-axis, form
 * a container that holds the most water. Return the maximum area.
 *
 * Example
 * -------
 * Input: height = [1, 8, 6, 2, 5, 4, 8, 3, 7]
 * Output: 49                     // lines at index 1 (8) and index 8 (7)
 *
 * Constraints
 * -----------
 * 2 <= height.length <= 10^5
 *
 * Approaches
 * ----------
 * 1. Brute force (`maxAreaBruteForce`) - Try every pair of lines. O(n^2) time,
 *    O(1) space.
 * 2. Better (`maxAreaBetter`) - Pruned brute force: for each left line i, scan
 *    right lines from the far end inward and stop at the first line at least
 *    as tall as height[i] (any closer line can only give a smaller width with
 *    the same capped height). Still O(n^2) worst case, O(1) space.
 * 3. Optimal (`maxAreaOptimal`) - Two pointers from both ends; always move the
 *    shorter line inward, since moving the taller one can never increase the
 *    area. O(n) time, O(1) space.
 */
import assert from "node:assert/strict";

/** Try every pair of lines. O(n^2) time, O(1) space. */
export function maxAreaBruteForce(height: number[]): number {
  let best = 0;
  for (let i = 0; i < height.length; i++) {
    for (let j = i + 1; j < height.length; j++) {
      best = Math.max(best, Math.min(height[i], height[j]) * (j - i));
    }
  }
  return best;
}

/**
 * Pruned brute force: for each left line i, scan right lines from the far
 * end inward and stop at the first line at least as tall as height[i]
 * (any closer line can only give a smaller width with the same capped
 * height). Still O(n^2) worst case, O(1) space.
 */
export function maxAreaBetter(height: number[]): number {
  let best = 0;
  for (let i = 0; i < height.length; i++) {
    for (let j = height.length - 1; j > i; j--) {
      best = Math.max(best, Math.min(height[i], height[j]) * (j - i));
      if (height[j] >= height[i]) break;
    }
  }
  return best;
}

/**
 * Two pointers from both ends; always move the shorter line inward, since
 * moving the taller one can never increase the area. O(n) time, O(1) space.
 */
export function maxAreaOptimal(height: number[]): number {
  let lo = 0;
  let hi = height.length - 1;
  let best = 0;
  while (lo < hi) {
    best = Math.max(best, Math.min(height[lo], height[hi]) * (hi - lo));
    if (height[lo] < height[hi]) lo++;
    else hi--;
  }
  return best;
}

if (import.meta.main) {
  const tests: [number[], number][] = [
    [[1, 8, 6, 2, 5, 4, 8, 3, 7], 49],
    [[1, 1], 1],
    [[4, 3, 2, 1, 4], 16],
  ];
  for (const [height, expected] of tests) {
    for (const fn of [maxAreaBruteForce, maxAreaBetter, maxAreaOptimal]) {
      assert.equal(fn([...height]), expected, `${fn.name}(${JSON.stringify(height)})`);
    }
  }
  console.log("All Container With Most Water tests passed.");
}
