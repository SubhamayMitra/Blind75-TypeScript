/**
 * 6. Maximum Product Subarray
 * LeetCode #152 | Difficulty: Medium | Category: Array
 *
 * Problem
 * -------
 * Given an integer array `nums`, find a contiguous non-empty subarray that
 * has the largest product, and return the product.
 *
 * Example
 * -------
 * Input: nums = [2, 3, -2, 4]
 * Output: 6                      // subarray [2, 3]
 *
 * Constraints
 * -----------
 * 1 <= nums.length <= 2*10^4
 *
 * Approaches
 * ----------
 * 1. Brute force (`maxProductBruteForce`) - Compute the product of every
 *    subarray. O(n^2) time, O(1) space.
 * 2. Better (`maxProductBetter`) - Prefix/suffix product scan. Between zeros,
 *    the maximum product subarray always starts at a segment's left edge or
 *    ends at its right edge (an odd count of negatives is fixed by dropping a
 *    prefix or a suffix), so a running product from the left and one from the
 *    right — each reset to 1 after a zero — covers every candidate. O(n) time,
 *    O(1) space.
 * 3. Optimal (`maxProductOptimal`) - Track both the running max AND min
 *    product ending at each index: a negative number turns the smallest
 *    product into the largest. O(n) time, O(1) space.
 */
import assert from "node:assert/strict";

/** Compute the product of every subarray. O(n^2) time, O(1) space. */
export function maxProductBruteForce(nums: number[]): number {
  let best = -Infinity;
  for (let i = 0; i < nums.length; i++) {
    let product = 1;
    for (let j = i; j < nums.length; j++) {
      product *= nums[j];
      best = Math.max(best, product);
    }
  }
  return best;
}

/**
 * Prefix/suffix product scan. Between zeros, the maximum product subarray
 * always starts at a segment's left edge or ends at its right edge (an odd
 * count of negatives is fixed by dropping a prefix or a suffix), so a
 * running product from the left and one from the right — each reset to 1
 * after a zero — covers every candidate. O(n) time, O(1) space.
 */
export function maxProductBetter(nums: number[]): number {
  const n = nums.length;
  let best = -Infinity;
  let prefix = 1;
  let suffix = 1;
  for (let i = 0; i < n; i++) {
    prefix = (prefix === 0 ? 1 : prefix) * nums[i];
    suffix = (suffix === 0 ? 1 : suffix) * nums[n - 1 - i];
    best = Math.max(best, prefix, suffix);
  }
  return best;
}

/**
 * Track both the running max AND min product ending at each index: a
 * negative number turns the smallest product into the largest.
 * O(n) time, O(1) space.
 */
export function maxProductOptimal(nums: number[]): number {
  let curMax = nums[0];
  let curMin = nums[0];
  let best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    const x = nums[i];
    const candidates = [x, curMax * x, curMin * x];
    curMax = Math.max(...candidates);
    curMin = Math.min(...candidates);
    best = Math.max(best, curMax);
  }
  return best;
}

if (import.meta.main) {
  const tests: [number[], number][] = [
    [[2, 3, -2, 4], 6],
    [[-2, 0, -1], 0],
    [[-2, 3, -4], 24],
    [[0, 2], 2],
    [[-2], -2],
  ];
  for (const [nums, expected] of tests) {
    for (const fn of [maxProductBruteForce, maxProductBetter, maxProductOptimal]) {
      assert.equal(fn([...nums]) + 0, expected, `${fn.name}(${JSON.stringify(nums)})`);
    }
  }
  console.log("All Maximum Product Subarray tests passed.");
}
