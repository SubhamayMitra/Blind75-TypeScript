/**
 * 26. Jump Game
 * LeetCode #55 | Difficulty: Medium | Category: Dynamic Programming / Greedy
 *
 * Problem
 * -------
 * Given an integer array `nums` where each element represents the maximum
 * jump length from that position, starting at index 0, return true if you
 * can reach the last index.
 *
 * Example
 * -------
 * Input: nums = [2, 3, 1, 1, 4]
 * Output: true
 *
 * Constraints
 * -----------
 * 1 <= nums.length <= 10^4
 *
 * Approaches
 * ----------
 * 1. Brute force (`canJumpBruteForce`) - Recursively try every jump length
 *    from each reachable index. O(2^n) time, O(n) space.
 * 2. Better (`canJumpBetter`) - dp[i] = can index i be reached; fill left to
 *    right by checking whether any earlier reachable j can jump to i. O(n^2)
 *    time, O(n) space.
 * 3. Optimal (`canJumpOptimal`) - Greedy: track the furthest reachable index
 *    while scanning; fail as soon as the current index is beyond it. O(n)
 *    time, O(1) space.
 */
import assert from "node:assert/strict";

/** Recursively try every jump length from each reachable index. O(2^n) time, O(n) space. */
export function canJumpBruteForce(nums: number[]): boolean {
  const solve = (i: number): boolean => {
    if (i >= nums.length - 1) return true;
    for (let step = 1; step <= nums[i]; step++) {
      if (solve(i + step)) return true;
    }
    return false;
  };
  return solve(0);
}

/**
 * dp[i] = can index i be reached; fill left to right by checking whether
 * any earlier reachable j can jump to i. O(n^2) time, O(n) space.
 */
export function canJumpBetter(nums: number[]): boolean {
  const n = nums.length;
  const reachable: boolean[] = new Array(n).fill(false);
  reachable[0] = true;
  for (let i = 1; i < n; i++) {
    for (let j = i - 1; j >= 0; j--) {
      if (reachable[j] && j + nums[j] >= i) {
        reachable[i] = true;
        break;
      }
    }
  }
  return reachable[n - 1];
}

/**
 * Greedy: track the furthest reachable index while scanning; fail as soon
 * as the current index is beyond it. O(n) time, O(1) space.
 */
export function canJumpOptimal(nums: number[]): boolean {
  let furthest = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > furthest) return false;
    furthest = Math.max(furthest, i + nums[i]);
    if (furthest >= nums.length - 1) return true;
  }
  return true;
}

if (import.meta.main) {
  const tests: [number[], boolean][] = [
    [[2, 3, 1, 1, 4], true],
    [[3, 2, 1, 0, 4], false],
    [[0], true],
    [[1, 0, 1, 0], false],
  ];
  for (const [nums, expected] of tests) {
    for (const fn of [canJumpBruteForce, canJumpBetter, canJumpOptimal]) {
      assert.equal(fn([...nums]), expected, `${fn.name}(${JSON.stringify(nums)})`);
    }
  }
  console.log("All Jump Game tests passed.");
}
