/**
 * 5. Maximum Subarray
 * LeetCode #53 | Difficulty: Medium | Category: Array
 *
 * Problem
 * -------
 * Given an integer array `nums`, find the contiguous subarray (containing
 * at least one number) which has the largest sum, and return that sum.
 *
 * Example
 * -------
 * Input: nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
 * Output: 6                      // subarray [4, -1, 2, 1]
 *
 * Constraints
 * -----------
 * 1 <= nums.length <= 10^5
 *
 * Approaches
 * ----------
 * 1. Brute force (`maxSubarrayBruteForce`) - Sum every subarray, extending
 *    each start index one element at a time. O(n^2) time, O(1) space.
 * 2. Better (`maxSubarrayDivideAndConquer`) - Divide and conquer: the best
 *    subarray lies entirely in the left half, entirely in the right half, or
 *    crosses the middle. O(n log n) time, O(log n) recursion space.
 * 3. Optimal (`maxSubarrayKadane`) - Kadane's algorithm: at each element
 *    either extend the running subarray or restart from this element. O(n)
 *    time, O(1) space.
 */
import assert from "node:assert/strict";

/** Sum every subarray, extending each start index one element at a time. O(n^2) time, O(1) space. */
export function maxSubarrayBruteForce(nums: number[]): number {
  let best = -Infinity;
  for (let i = 0; i < nums.length; i++) {
    let sum = 0;
    for (let j = i; j < nums.length; j++) {
      sum += nums[j];
      best = Math.max(best, sum);
    }
  }
  return best;
}

/**
 * Divide and conquer: the best subarray lies entirely in the left half,
 * entirely in the right half, or crosses the middle.
 * O(n log n) time, O(log n) recursion space.
 */
export function maxSubarrayDivideAndConquer(nums: number[]): number {
  const solve = (lo: number, hi: number): number => {
    if (lo === hi) return nums[lo];
    const mid = (lo + hi) >> 1;

    let leftBest = -Infinity;
    let sum = 0;
    for (let i = mid; i >= lo; i--) {
      sum += nums[i];
      leftBest = Math.max(leftBest, sum);
    }
    let rightBest = -Infinity;
    sum = 0;
    for (let i = mid + 1; i <= hi; i++) {
      sum += nums[i];
      rightBest = Math.max(rightBest, sum);
    }

    return Math.max(solve(lo, mid), solve(mid + 1, hi), leftBest + rightBest);
  };
  return solve(0, nums.length - 1);
}

/**
 * Kadane's algorithm: at each element either extend the running subarray
 * or restart from this element. O(n) time, O(1) space.
 */
export function maxSubarrayKadane(nums: number[]): number {
  let current = nums[0];
  let best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    current = Math.max(nums[i], current + nums[i]);
    best = Math.max(best, current);
  }
  return best;
}

if (import.meta.main) {
  const tests: [number[], number][] = [
    [[-2, 1, -3, 4, -1, 2, 1, -5, 4], 6],
    [[1], 1],
    [[5, 4, -1, 7, 8], 23],
    [[-1, -2, -3], -1],
  ];
  for (const [nums, expected] of tests) {
    for (const fn of [maxSubarrayBruteForce, maxSubarrayDivideAndConquer, maxSubarrayKadane]) {
      assert.equal(fn([...nums]), expected, `${fn.name}(${JSON.stringify(nums)})`);
    }
  }
  console.log("All Maximum Subarray tests passed.");
}
