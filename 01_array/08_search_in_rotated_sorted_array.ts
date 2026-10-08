/**
 * 8. Search in Rotated Sorted Array
 * LeetCode #33 | Difficulty: Medium | Category: Array / Binary Search
 *
 * Problem
 * -------
 * An array of distinct integers, sorted ascending, was rotated at an
 * unknown pivot. Given the rotated array `nums` and a `target`, return the
 * index of `target` if it exists, else -1. Must run in O(log n) time.
 *
 * Example
 * -------
 * Input: nums = [4, 5, 6, 7, 0, 1, 2], target = 0
 * Output: 4
 *
 * Constraints
 * -----------
 * 1 <= nums.length <= 5000, all values distinct.
 *
 * Approaches
 * ----------
 * 1. Brute force (`searchBruteForce`) - Linear scan for the target. O(n) time,
 *    O(1) space.
 * 2. Better (`searchBetter`) - Find the pivot (index of the minimum) with
 *    binary search, then run a normal binary search on whichever sorted half
 *    could hold the target. O(log n) time, O(1) space.
 * 3. Optimal (`searchOptimal`) - One-pass modified binary search: at each step
 *    one half is sorted; check whether the target lies inside that half's
 *    range and discard the other. O(log n) time, O(1) space.
 */
import assert from "node:assert/strict";

/** Linear scan for the target. O(n) time, O(1) space. */
export function searchBruteForce(nums: number[], target: number): number {
  return nums.indexOf(target);
}

function binarySearch(nums: number[], lo: number, hi: number, target: number): number {
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}

/**
 * Find the pivot (index of the minimum) with binary search, then run a
 * normal binary search on whichever sorted half could hold the target.
 * O(log n) time, O(1) space.
 */
export function searchBetter(nums: number[], target: number): number {
  const n = nums.length;
  let lo = 0;
  let hi = n - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] > nums[hi]) lo = mid + 1;
    else hi = mid;
  }
  const pivot = lo;
  if (target >= nums[pivot] && target <= nums[n - 1]) return binarySearch(nums, pivot, n - 1, target);
  return binarySearch(nums, 0, pivot - 1, target);
}

/**
 * One-pass modified binary search: at each step one half is sorted; check
 * whether the target lies inside that half's range and discard the other.
 * O(log n) time, O(1) space.
 */
export function searchOptimal(nums: number[], target: number): number {
  let lo = 0;
  let hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[lo] <= nums[mid]) {
      // left half [lo..mid] is sorted
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      // right half [mid..hi] is sorted
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}

if (import.meta.main) {
  const tests: [number[], number, number][] = [
    [[4, 5, 6, 7, 0, 1, 2], 0, 4],
    [[4, 5, 6, 7, 0, 1, 2], 3, -1],
    [[1], 0, -1],
    [[3, 1], 1, 1],
    [[1, 3], 3, 1],
  ];
  for (const [nums, target, expected] of tests) {
    for (const fn of [searchBruteForce, searchBetter, searchOptimal]) {
      assert.equal(fn([...nums], target), expected, `${fn.name}(${JSON.stringify(nums)}, ${target})`);
    }
  }
  console.log("All Search in Rotated Sorted Array tests passed.");
}
