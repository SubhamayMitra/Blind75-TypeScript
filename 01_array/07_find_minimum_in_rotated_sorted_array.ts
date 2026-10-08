/**
 * 7. Find Minimum in Rotated Sorted Array
 * LeetCode #153 | Difficulty: Medium | Category: Array / Binary Search
 *
 * Problem
 * -------
 * An array of distinct integers, originally sorted in ascending order, was
 * rotated between 1 and n times. Given the rotated array `nums`, return the
 * minimum element, in O(log n) time.
 *
 * Example
 * -------
 * Input: nums = [4, 5, 6, 7, 0, 1, 2]
 * Output: 0
 *
 * Constraints
 * -----------
 * 1 <= nums.length <= 5000, all values distinct.
 *
 * Approaches
 * ----------
 * 1. Brute force (`findMinBruteForce`) - Linear scan for the minimum. O(n)
 *    time, O(1) space.
 * 2. Better (`findMinBetter`) - Binary search comparing against nums[0]:
 *    values >= nums[0] belong to the left (higher) sorted run, so the minimum
 *    is the first value < nums[0]. If the array is not rotated, nums[0] is the
 *    answer. O(log n) time, O(1) space.
 * 3. Optimal (`findMinOptimal`) - Binary search on the invariant nums[mid] vs
 *    nums[hi]: if nums[mid] > nums[hi] the minimum is strictly right of mid,
 *    otherwise it is at mid or left of it. O(log n) time, O(1) space.
 */
import assert from "node:assert/strict";

/** Linear scan for the minimum. O(n) time, O(1) space. */
export function findMinBruteForce(nums: number[]): number {
  return Math.min(...nums);
}

/**
 * Binary search comparing against nums[0]: values >= nums[0] belong to the
 * left (higher) sorted run, so the minimum is the first value < nums[0].
 * If the array is not rotated, nums[0] is the answer. O(log n) time, O(1) space.
 */
export function findMinBetter(nums: number[]): number {
  if (nums[0] <= nums[nums.length - 1]) return nums[0];
  let lo = 0;
  let hi = nums.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] >= nums[0]) lo = mid + 1;
    else hi = mid;
  }
  return nums[lo];
}

/**
 * Binary search on the invariant nums[mid] vs nums[hi]: if nums[mid] > nums[hi]
 * the minimum is strictly right of mid, otherwise it is at mid or left of it.
 * O(log n) time, O(1) space.
 */
export function findMinOptimal(nums: number[]): number {
  let lo = 0;
  let hi = nums.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] > nums[hi]) lo = mid + 1;
    else hi = mid;
  }
  return nums[lo];
}

if (import.meta.main) {
  const tests: [number[], number][] = [
    [[3, 4, 5, 1, 2], 1],
    [[4, 5, 6, 7, 0, 1, 2], 0],
    [[11, 13, 15, 17], 11],
    [[2, 1], 1],
  ];
  for (const [nums, expected] of tests) {
    for (const fn of [findMinBruteForce, findMinBetter, findMinOptimal]) {
      assert.equal(fn([...nums]), expected, `${fn.name}(${JSON.stringify(nums)})`);
    }
  }
  console.log("All Find Minimum in Rotated Sorted Array tests passed.");
}
