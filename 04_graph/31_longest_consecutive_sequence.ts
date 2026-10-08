/**
 * 31. Longest Consecutive Sequence
 * LeetCode #128 | Difficulty: Medium | Category: Array / Graph (union-find style)
 *
 * Problem
 * -------
 * Given an unsorted array of integers `nums`, return the length of the
 * longest run of consecutive integers, in O(n) time.
 *
 * Example
 * -------
 * Input: nums = [100, 4, 200, 1, 3, 2]
 * Output: 4           // [1, 2, 3, 4]
 *
 * Constraints
 * -----------
 * 0 <= nums.length <= 10^5
 *
 * Approaches
 * ----------
 * 1. Brute force (`longestConsecutiveBruteForce`) - For each number, keep
 *    counting upward while the next value is present, checking presence with a
 *    linear `includes` scan. O(n^3) worst case, O(1) space.
 * 2. Better (`longestConsecutiveBetter`) - Sort, then scan for consecutive
 *    runs, skipping duplicates. O(n log n) time, O(1) extra space.
 * 3. Optimal (`longestConsecutiveOptimal`) - Hash set of all numbers; only
 *    start counting from a number that begins a run (num - 1 is absent), so
 *    each number is touched at most twice. O(n) time, O(n) space.
 */
import assert from "node:assert/strict";

/**
 * For each number, keep counting upward while the next value is present,
 * checking presence with a linear `includes` scan. O(n^3) worst case, O(1) space.
 */
export function longestConsecutiveBruteForce(nums: number[]): number {
  let best = 0;
  for (const num of nums) {
    let length = 1;
    while (nums.includes(num + length)) length++;
    best = Math.max(best, length);
  }
  return best;
}

/** Sort, then scan for consecutive runs, skipping duplicates. O(n log n) time, O(1) extra space. */
export function longestConsecutiveBetter(nums: number[]): number {
  if (nums.length === 0) return 0;
  nums.sort((a, b) => a - b);
  let best = 1;
  let current = 1;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] === nums[i - 1]) continue;
    current = nums[i] === nums[i - 1] + 1 ? current + 1 : 1;
    best = Math.max(best, current);
  }
  return best;
}

/**
 * Hash set of all numbers; only start counting from a number that begins a
 * run (num - 1 is absent), so each number is touched at most twice.
 * O(n) time, O(n) space.
 */
export function longestConsecutiveOptimal(nums: number[]): number {
  const set = new Set(nums);
  let best = 0;
  for (const num of set) {
    if (set.has(num - 1)) continue;
    let length = 1;
    while (set.has(num + length)) length++;
    best = Math.max(best, length);
  }
  return best;
}

if (import.meta.main) {
  const tests: [number[], number][] = [
    [[100, 4, 200, 1, 3, 2], 4],
    [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1], 9],
    [[], 0],
    [[1, 2, 0, 1], 3],
  ];
  for (const [nums, expected] of tests) {
    for (const fn of [longestConsecutiveBruteForce, longestConsecutiveBetter, longestConsecutiveOptimal]) {
      assert.equal(fn([...nums]), expected, `${fn.name}(${JSON.stringify(nums)})`);
    }
  }
  console.log("All Longest Consecutive Sequence tests passed.");
}
