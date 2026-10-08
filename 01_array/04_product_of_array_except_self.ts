/**
 * 4. Product of Array Except Self
 * LeetCode #238 | Difficulty: Medium | Category: Array
 *
 * Problem
 * -------
 * Given an integer array `nums`, return an array `answer` such that
 * answer[i] is equal to the product of all elements of `nums` except
 * nums[i]. Must run in O(n) and (in the follow-up) without using division,
 * using O(1) extra space excluding the output array.
 *
 * Example
 * -------
 * Input: nums = [1, 2, 3, 4]
 * Output: [24, 12, 8, 6]
 *
 * Constraints
 * -----------
 * 2 <= nums.length <= 10^5, product of any prefix/suffix fits in a 32-bit int.
 *
 * Approaches
 * ----------
 * 1. Brute force (`productExceptSelfBruteForce`) - For each i, multiply every
 *    j != i. O(n^2) time, O(1) extra space.
 * 2. Better (`productExceptSelfBetter`) - Division trick: product of all non-
 *    zero values, divided by nums[i]. Zeros are handled separately: with two
 *    or more zeros everything is 0; with exactly one zero only that index gets
 *    the non-zero product. O(n) time, O(1) extra space.
 * 3. Optimal (`productExceptSelfOptimal`) - Prefix products written left-to-
 *    right into the output, then multiplied by suffix products right-to-left.
 *    No division needed. O(n) time, O(1) extra space (output array excluded).
 */
import assert from "node:assert/strict";

/** For each i, multiply every j != i. O(n^2) time, O(1) extra space. */
export function productExceptSelfBruteForce(nums: number[]): number[] {
  const n = nums.length;
  const answer: number[] = new Array(n).fill(1);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j) answer[i] *= nums[j];
    }
  }
  return answer;
}

/**
 * Division trick: product of all non-zero values, divided by nums[i].
 * Zeros are handled separately: with two or more zeros everything is 0;
 * with exactly one zero only that index gets the non-zero product.
 * O(n) time, O(1) extra space.
 */
export function productExceptSelfBetter(nums: number[]): number[] {
  let zeroCount = 0;
  let product = 1;
  for (const num of nums) {
    if (num === 0) zeroCount++;
    else product *= num;
  }
  return nums.map((num) => {
    if (zeroCount > 1) return 0;
    if (zeroCount === 1) return num === 0 ? product : 0;
    return product / num;
  });
}

/**
 * Prefix products written left-to-right into the output, then multiplied
 * by suffix products right-to-left. No division needed.
 * O(n) time, O(1) extra space (output array excluded).
 */
export function productExceptSelfOptimal(nums: number[]): number[] {
  const n = nums.length;
  const answer: number[] = new Array(n);
  let prefix = 1;
  for (let i = 0; i < n; i++) {
    answer[i] = prefix;
    prefix *= nums[i];
  }
  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    answer[i] *= suffix;
    suffix *= nums[i];
  }
  return answer;
}

if (import.meta.main) {
  // `+ 0` normalises -0 to 0 so strict deepEqual compares cleanly.
  const normalize = (arr: number[]) => arr.map((x) => x + 0);
  const tests: [number[], number[]][] = [
    [[1, 2, 3, 4], [24, 12, 8, 6]],
    [[-1, 1, 0, -3, 3], [0, 0, 9, 0, 0]],
    [[0, 0], [0, 0]],
  ];
  for (const [nums, expected] of tests) {
    for (const fn of [productExceptSelfBruteForce, productExceptSelfBetter, productExceptSelfOptimal]) {
      assert.deepEqual(normalize(fn([...nums])), expected, `${fn.name}(${JSON.stringify(nums)})`);
    }
  }
  console.log("All Product of Array Except Self tests passed.");
}
