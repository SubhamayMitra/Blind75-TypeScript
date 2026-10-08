/**
 * 1. Two Sum
 * LeetCode #1 | Difficulty: Easy | Category: Array
 *
 * Problem
 * -------
 * Given an array of integers `nums` and an integer `target`, return the
 * indices of the two numbers such that they add up to `target`.
 *
 * You may assume that each input has exactly one solution, and you may not
 * use the same element twice. Return the answer in any order.
 *
 * Example
 * -------
 * Input: nums = [2, 7, 11, 15], target = 9
 * Output: [0, 1]                 // nums[0] + nums[1] == 9
 *
 * Constraints
 * -----------
 * 2 <= nums.length <= 10^4
 * -10^9 <= nums[i], target <= 10^9
 *
 * Approaches
 * ----------
 * 1. Brute force (`twoSumBruteForce`) - Check every pair of indices. O(n^2)
 *    time, O(1) extra space.
 * 2. Better (`twoSumBetter`) - Sort (index, value) pairs and use two pointers
 *    to find the pair, then report the *original* indices. O(n log n) time,
 *    O(n) space.
 * 3. Optimal (`twoSumOptimal`) - Single pass hash map of value -> index. For
 *    each element, check whether its complement was already seen. O(n) time,
 *    O(n) space.
 */
import assert from "node:assert/strict";

/** Check every pair of indices. O(n^2) time, O(1) extra space. */
export function twoSumBruteForce(nums: number[], target: number): number[] {
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (nums[i] + nums[j] === target) return [i, j];
    }
  }
  return [];
}

/**
 * Sort (index, value) pairs and use two pointers to find the pair, then
 * report the *original* indices. O(n log n) time, O(n) space.
 */
export function twoSumBetter(nums: number[], target: number): number[] {
  const indexed = nums.map((value, index) => ({ value, index })).sort((a, b) => a.value - b.value);
  let lo = 0;
  let hi = indexed.length - 1;
  while (lo < hi) {
    const sum = indexed[lo].value + indexed[hi].value;
    if (sum === target) return [indexed[lo].index, indexed[hi].index].sort((a, b) => a - b);
    if (sum < target) lo++;
    else hi--;
  }
  return [];
}

/**
 * Single pass hash map of value -> index. For each element, check whether
 * its complement was already seen. O(n) time, O(n) space.
 */
export function twoSumOptimal(nums: number[], target: number): number[] {
  const seen = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    const j = seen.get(complement);
    if (j !== undefined) return [j, i];
    seen.set(nums[i], i);
  }
  return [];
}

if (import.meta.main) {
  const tests: [number[], number, number[]][] = [
    [[2, 7, 11, 15], 9, [0, 1]],
    [[3, 2, 4], 6, [1, 2]],
    [[3, 3], 6, [0, 1]],
  ];
  for (const [nums, target, expected] of tests) {
    for (const fn of [twoSumBruteForce, twoSumBetter, twoSumOptimal]) {
      const result = fn(nums, target).sort((a, b) => a - b);
      assert.deepEqual(result, expected, `${fn.name}(${JSON.stringify(nums)}, ${target})`);
    }
  }
  console.log("All Two Sum tests passed.");
}
