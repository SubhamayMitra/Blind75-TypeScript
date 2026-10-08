/**
 * 3. Contains Duplicate
 * LeetCode #217 | Difficulty: Easy | Category: Array
 *
 * Problem
 * -------
 * Given an integer array `nums`, return true if any value appears at least
 * twice in the array, and false if every element is distinct.
 *
 * Example
 * -------
 * Input: nums = [1, 2, 3, 1]
 * Output: true
 *
 * Constraints
 * -----------
 * 1 <= nums.length <= 10^5
 *
 * Approaches
 * ----------
 * 1. Brute force (`containsDuplicateBruteForce`) - Compare every pair. O(n^2)
 *    time, O(1) space.
 * 2. Better (`containsDuplicateBetter`) - Sort, then any duplicates must be
 *    adjacent. O(n log n) time, O(1) extra space (sorts in place).
 * 3. Optimal (`containsDuplicateOptimal`) - Hash set membership test while
 *    scanning. O(n) time, O(n) space.
 */
import assert from "node:assert/strict";

/** Compare every pair. O(n^2) time, O(1) space. */
export function containsDuplicateBruteForce(nums: number[]): boolean {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] === nums[j]) return true;
    }
  }
  return false;
}

/** Sort, then any duplicates must be adjacent. O(n log n) time, O(1) extra space (sorts in place). */
export function containsDuplicateBetter(nums: number[]): boolean {
  nums.sort((a, b) => a - b);
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] === nums[i - 1]) return true;
  }
  return false;
}

/** Hash set membership test while scanning. O(n) time, O(n) space. */
export function containsDuplicateOptimal(nums: number[]): boolean {
  const seen = new Set<number>();
  for (const num of nums) {
    if (seen.has(num)) return true;
    seen.add(num);
  }
  return false;
}

if (import.meta.main) {
  const tests: [number[], boolean][] = [
    [[1, 2, 3, 1], true],
    [[1, 2, 3, 4], false],
    [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2], true],
  ];
  for (const [nums, expected] of tests) {
    for (const fn of [containsDuplicateBruteForce, containsDuplicateBetter, containsDuplicateOptimal]) {
      assert.equal(fn([...nums]), expected, `${fn.name}(${JSON.stringify(nums)})`);
    }
  }
  console.log("All Contains Duplicate tests passed.");
}
