/**
 * 23. House Robber II
 * LeetCode #213 | Difficulty: Medium | Category: Dynamic Programming
 *
 * Problem
 * -------
 * Same as House Robber, but the houses are arranged in a circle - the
 * first and last house are adjacent to each other. Return the maximum
 * amount you can rob without robbing two adjacent houses.
 *
 * Example
 * -------
 * Input: nums = [2, 3, 2]
 * Output: 3           // robbing houses 0 and 2 is illegal since they're
 *                      // adjacent in the circle; best is just house 1 (3)
 *
 * Constraints
 * -----------
 * 1 <= nums.length <= 100
 *
 * Approaches
 * ----------
 * 1. Brute force (`robIIBruteForce`) - Recursively decide rob/skip for each
 *    house, remembering whether house 0 was robbed so the last house is
 *    forbidden in that case. O(2^n) time, O(n) space.
 * 2. Better (`robIIBetter`) - Run memoized linear House Robber twice — on
 *    houses [0, n-2] and [1, n-1] (the first and last can never both be
 *    robbed) — and take the max. O(n) time, O(n) space.
 * 3. Optimal (`robIIOptimal`) - Same split, using the O(1)-space rolling-
 *    variable House Robber DP. O(n) time, O(1) space.
 */
import assert from "node:assert/strict";

/**
 * Recursively decide rob/skip for each house, remembering whether house 0
 * was robbed so the last house is forbidden in that case.
 * O(2^n) time, O(n) space.
 */
export function robIIBruteForce(nums: number[]): number {
  const n = nums.length;
  if (n === 1) return nums[0];
  const solve = (i: number, robbedFirst: boolean): number => {
    if (i >= n) return 0;
    if (i === n - 1 && robbedFirst) return 0;
    const take = nums[i] + solve(i + 2, robbedFirst || i === 0);
    const skip = solve(i + 1, robbedFirst);
    return Math.max(take, skip);
  };
  return solve(0, false);
}

/**
 * Run memoized linear House Robber twice — on houses [0, n-2] and [1, n-1]
 * (the first and last can never both be robbed) — and take the max.
 * O(n) time, O(n) space.
 */
export function robIIBetter(nums: number[]): number {
  const n = nums.length;
  if (n === 1) return nums[0];
  const robRange = (lo: number, hi: number): number => {
    const memo = new Map<number, number>();
    const solve = (i: number): number => {
      if (i > hi) return 0;
      const cached = memo.get(i);
      if (cached !== undefined) return cached;
      const result = Math.max(nums[i] + solve(i + 2), solve(i + 1));
      memo.set(i, result);
      return result;
    };
    return solve(lo);
  };
  return Math.max(robRange(0, n - 2), robRange(1, n - 1));
}

/** Same split, using the O(1)-space rolling-variable House Robber DP. O(n) time, O(1) space. */
export function robIIOptimal(nums: number[]): number {
  const n = nums.length;
  if (n === 1) return nums[0];
  const robRange = (lo: number, hi: number): number => {
    let prev = 0;
    let curr = 0;
    for (let i = lo; i <= hi; i++) [prev, curr] = [curr, Math.max(curr, prev + nums[i])];
    return curr;
  };
  return Math.max(robRange(0, n - 2), robRange(1, n - 1));
}

if (import.meta.main) {
  const tests: [number[], number][] = [
    [[2, 3, 2], 3],
    [[1, 2, 3, 1], 4],
    [[1, 2, 3], 3],
    [[5], 5],
  ];
  for (const [nums, expected] of tests) {
    for (const fn of [robIIBruteForce, robIIBetter, robIIOptimal]) {
      assert.equal(fn([...nums]), expected, `${fn.name}(${JSON.stringify(nums)})`);
    }
  }
  console.log("All House Robber II tests passed.");
}
