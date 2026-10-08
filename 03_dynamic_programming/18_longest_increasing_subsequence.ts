/**
 * 18. Longest Increasing Subsequence
 * LeetCode #300 | Difficulty: Medium | Category: Dynamic Programming
 *
 * Problem
 * -------
 * Given an integer array `nums`, return the length of the longest strictly
 * increasing subsequence (elements need not be contiguous, but must keep
 * their relative order).
 *
 * Example
 * -------
 * Input: nums = [10, 9, 2, 5, 3, 7, 101, 18]
 * Output: 4           // [2, 3, 7, 101]
 *
 * Constraints
 * -----------
 * 1 <= nums.length <= 2500
 *
 * Approaches
 * ----------
 * 1. Brute force (`lengthOfLisBruteForce`) - Recursively include/exclude each
 *    element, tracking the last taken value. O(2^n) time, O(n) space.
 * 2. Better (`lengthOfLisBetter`) - dp[i] = length of the LIS ending at i,
 *    checking every j < i. O(n^2) time, O(n) space.
 * 3. Optimal (`lengthOfLisOptimal`) - Patience sorting: tails[k] = smallest
 *    tail of any increasing subsequence of length k + 1. Each number replaces
 *    the first tail >= it (binary search) or extends the array. O(n log n)
 *    time, O(n) space.
 */
import assert from "node:assert/strict";

/** Recursively include/exclude each element, tracking the last taken value. O(2^n) time, O(n) space. */
export function lengthOfLisBruteForce(nums: number[]): number {
  const solve = (i: number, prev: number): number => {
    if (i === nums.length) return 0;
    let best = solve(i + 1, prev); // skip nums[i]
    if (nums[i] > prev) best = Math.max(best, 1 + solve(i + 1, nums[i])); // take nums[i]
    return best;
  };
  return solve(0, -Infinity);
}

/** dp[i] = length of the LIS ending at i, checking every j < i. O(n^2) time, O(n) space. */
export function lengthOfLisBetter(nums: number[]): number {
  const dp: number[] = new Array(nums.length).fill(1);
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
    }
  }
  return Math.max(...dp);
}

/**
 * Patience sorting: tails[k] = smallest tail of any increasing subsequence
 * of length k + 1. Each number replaces the first tail >= it (binary
 * search) or extends the array. O(n log n) time, O(n) space.
 */
export function lengthOfLisOptimal(nums: number[]): number {
  const tails: number[] = [];
  for (const num of nums) {
    let lo = 0;
    let hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < num) lo = mid + 1;
      else hi = mid;
    }
    tails[lo] = num;
  }
  return tails.length;
}

if (import.meta.main) {
  const tests: [number[], number][] = [
    [[10, 9, 2, 5, 3, 7, 101, 18], 4],
    [[0, 1, 0, 3, 2, 3], 4],
    [[7, 7, 7, 7, 7, 7, 7], 1],
  ];
  for (const [nums, expected] of tests) {
    for (const fn of [lengthOfLisBruteForce, lengthOfLisBetter, lengthOfLisOptimal]) {
      assert.equal(fn([...nums]), expected, `${fn.name}(${JSON.stringify(nums)})`);
    }
  }
  console.log("All Longest Increasing Subsequence tests passed.");
}
