/**
 * 22. House Robber
 * LeetCode #198 | Difficulty: Medium | Category: Dynamic Programming
 *
 * Problem
 * -------
 * Given an integer array `nums` representing money stashed in houses along
 * a street, return the maximum amount you can rob without robbing two
 * adjacent houses (robbing adjacent houses trips the alarm).
 *
 * Example
 * -------
 * Input: nums = [1, 2, 3, 1]
 * Output: 4           // rob house 0 (1) and house 2 (3)
 *
 * Constraints
 * -----------
 * 1 <= nums.length <= 100
 *
 * Approaches
 * ----------
 * 1. Brute force (`robBruteForce`) - Recursively decide rob/skip for each
 *    house. O(2^n) time, O(n) space.
 * 2. Better (`robBetter`) - Top-down recursion + memoization. O(n) time, O(n)
 *    space.
 * 3. Optimal (`robOptimal`) - Bottom-up DP with two rolling variables. O(n)
 *    time, O(1) space.
 */
import assert from "node:assert/strict";

/** Recursively decide rob/skip for each house. O(2^n) time, O(n) space. */
export function robBruteForce(nums: number[]): number {
  const solve = (i: number): number => {
    if (i >= nums.length) return 0;
    return Math.max(nums[i] + solve(i + 2), solve(i + 1));
  };
  return solve(0);
}

/** Top-down recursion + memoization. O(n) time, O(n) space. */
export function robBetter(nums: number[]): number {
  const memo: number[] = new Array(nums.length).fill(-1);
  const solve = (i: number): number => {
    if (i >= nums.length) return 0;
    if (memo[i] === -1) memo[i] = Math.max(nums[i] + solve(i + 2), solve(i + 1));
    return memo[i];
  };
  return solve(0);
}

/** Bottom-up DP with two rolling variables. O(n) time, O(1) space. */
export function robOptimal(nums: number[]): number {
  let prev = 0; // best up to house i - 2
  let curr = 0; // best up to house i - 1
  for (const num of nums) [prev, curr] = [curr, Math.max(curr, prev + num)];
  return curr;
}

if (import.meta.main) {
  const tests: [number[], number][] = [
    [[1, 2, 3, 1], 4],
    [[2, 7, 9, 3, 1], 12],
    [[2, 1, 1, 2], 4],
    [[5], 5],
  ];
  for (const [nums, expected] of tests) {
    for (const fn of [robBruteForce, robBetter, robOptimal]) {
      assert.equal(fn([...nums]), expected, `${fn.name}(${JSON.stringify(nums)})`);
    }
  }
  console.log("All House Robber tests passed.");
}
