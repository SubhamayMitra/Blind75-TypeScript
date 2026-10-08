/**
 * 21. Combination Sum IV
 * LeetCode #377 | Difficulty: Medium | Category: Dynamic Programming
 *
 * Problem
 * -------
 * Given an array of distinct positive integers `nums` and a target integer
 * `target`, return the number of possible combinations that add up to
 * `target`. Order matters here (different orderings count separately),
 * which makes it more like counting sequences than combinations.
 *
 * Example
 * -------
 * Input: nums = [1, 2, 3], target = 4
 * Output: 7           // (1,1,1,1),(1,1,2),(1,2,1),(1,3),(2,1,1),(2,2),(3,1)
 *
 * Constraints
 * -----------
 * 1 <= nums.length <= 200, target <= 1000, all nums distinct and positive.
 *
 * Approaches
 * ----------
 * 1. Brute force (`combinationSum4BruteForce`) - Recursively try every number
 *    at every step, counting paths that hit target exactly. O(k^target) time,
 *    O(target) space.
 * 2. Better (`combinationSum4Better`) - Top-down recursion + memoization on
 *    the remaining target. O(target * k) time, O(target) space.
 * 3. Optimal (`combinationSum4Optimal`) - Bottom-up DP: dp[t] = number of
 *    ordered sequences summing to t, with dp[0] = 1 and dp[t] = sum(dp[t -
 *    num]). O(target * k) time, O(target) space.
 */
import assert from "node:assert/strict";

/** Recursively try every number at every step, counting paths that hit target exactly. O(k^target) time, O(target) space. */
export function combinationSum4BruteForce(nums: number[], target: number): number {
  const count = (remaining: number): number => {
    if (remaining === 0) return 1;
    let total = 0;
    for (const num of nums) {
      if (num <= remaining) total += count(remaining - num);
    }
    return total;
  };
  return count(target);
}

/** Top-down recursion + memoization on the remaining target. O(target * k) time, O(target) space. */
export function combinationSum4Better(nums: number[], target: number): number {
  const memo = new Map<number, number>();
  const count = (remaining: number): number => {
    if (remaining === 0) return 1;
    const cached = memo.get(remaining);
    if (cached !== undefined) return cached;
    let total = 0;
    for (const num of nums) {
      if (num <= remaining) total += count(remaining - num);
    }
    memo.set(remaining, total);
    return total;
  };
  return count(target);
}

/**
 * Bottom-up DP: dp[t] = number of ordered sequences summing to t, with
 * dp[0] = 1 and dp[t] = sum(dp[t - num]). O(target * k) time, O(target) space.
 */
export function combinationSum4Optimal(nums: number[], target: number): number {
  const dp: number[] = new Array(target + 1).fill(0);
  dp[0] = 1;
  for (let t = 1; t <= target; t++) {
    for (const num of nums) {
      if (num <= t) dp[t] += dp[t - num];
    }
  }
  return dp[target];
}

if (import.meta.main) {
  const tests: [number[], number, number][] = [
    [[1, 2, 3], 4, 7],
    [[9], 3, 0],
    [[1], 1, 1],
  ];
  for (const [nums, target, expected] of tests) {
    for (const fn of [combinationSum4BruteForce, combinationSum4Better, combinationSum4Optimal]) {
      assert.equal(fn(nums, target), expected, `${fn.name}(${JSON.stringify(nums)}, ${target})`);
    }
  }
  console.log("All Combination Sum IV tests passed.");
}
