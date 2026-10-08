/**
 * 14. Missing Number
 * LeetCode #268 | Difficulty: Easy | Category: Binary / Array
 *
 * Problem
 * -------
 * Given an array `nums` containing n distinct numbers in the range
 * [0, n], return the one number in that range that is missing from the
 * array.
 *
 * Example
 * -------
 * Input: nums = [3, 0, 1]
 * Output: 2
 *
 * Constraints
 * -----------
 * 1 <= n <= 10^4
 *
 * Approaches
 * ----------
 * 1. Brute force (`missingNumberBruteForce`) - For each candidate in [0, n],
 *    scan the array for it. O(n^2) time, O(1) space.
 * 2. Better (`missingNumberBetter`) - Sort, then return the first index whose
 *    value differs from it. O(n log n) time, O(1) extra space.
 * 3. Optimal (`missingNumberOptimal`) - XOR every index 0..n with every value;
 *    each present number cancels itself out, leaving only the missing one.
 *    (Gauss's sum formula n(n+1)/2 - sum(nums) works equally well.) O(n) time,
 *    O(1) space.
 */
import assert from "node:assert/strict";

/** For each candidate in [0, n], scan the array for it. O(n^2) time, O(1) space. */
export function missingNumberBruteForce(nums: number[]): number {
  for (let candidate = 0; candidate <= nums.length; candidate++) {
    if (!nums.includes(candidate)) return candidate;
  }
  return -1;
}

/** Sort, then return the first index whose value differs from it. O(n log n) time, O(1) extra space. */
export function missingNumberBetter(nums: number[]): number {
  nums.sort((a, b) => a - b);
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== i) return i;
  }
  return nums.length;
}

/**
 * XOR every index 0..n with every value; each present number cancels
 * itself out, leaving only the missing one. (Gauss's sum formula
 * n(n+1)/2 - sum(nums) works equally well.) O(n) time, O(1) space.
 */
export function missingNumberOptimal(nums: number[]): number {
  let result = nums.length;
  for (let i = 0; i < nums.length; i++) result ^= i ^ nums[i];
  return result;
}

if (import.meta.main) {
  const tests: [number[], number][] = [
    [[3, 0, 1], 2],
    [[0, 1], 2],
    [[9, 6, 4, 2, 3, 5, 7, 0, 1], 8],
  ];
  for (const [nums, expected] of tests) {
    for (const fn of [missingNumberBruteForce, missingNumberBetter, missingNumberOptimal]) {
      assert.equal(fn([...nums]), expected, `${fn.name}(${JSON.stringify(nums)})`);
    }
  }
  console.log("All Missing Number tests passed.");
}
