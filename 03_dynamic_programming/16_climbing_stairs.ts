/**
 * 16. Climbing Stairs
 * LeetCode #70 | Difficulty: Easy | Category: Dynamic Programming
 *
 * Problem
 * -------
 * You are climbing a staircase with `n` steps. Each time you can climb
 * either 1 or 2 steps. In how many distinct ways can you climb to the top?
 *
 * Example
 * -------
 * Input: n = 3
 * Output: 3          // (1,1,1), (1,2), (2,1)
 *
 * Constraints
 * -----------
 * 1 <= n <= 45
 *
 * Approaches
 * ----------
 * 1. Brute force (`climbStairsBruteForce`) - Plain recursion trying both step
 *    sizes. O(2^n) time, O(n) stack space.
 * 2. Better (`climbStairsBetter`) - Top-down recursion + memoization. O(n)
 *    time, O(n) space.
 * 3. Optimal (`climbStairsOptimal`) - Bottom-up DP with two rolling variables
 *    (the Fibonacci recurrence). O(n) time, O(1) space.
 */
import assert from "node:assert/strict";

/** Plain recursion trying both step sizes. O(2^n) time, O(n) stack space. */
export function climbStairsBruteForce(n: number): number {
  if (n <= 1) return 1;
  return climbStairsBruteForce(n - 1) + climbStairsBruteForce(n - 2);
}

/** Top-down recursion + memoization. O(n) time, O(n) space. */
export function climbStairsBetter(n: number): number {
  const memo = new Map<number, number>();
  const ways = (k: number): number => {
    if (k <= 1) return 1;
    const cached = memo.get(k);
    if (cached !== undefined) return cached;
    const result = ways(k - 1) + ways(k - 2);
    memo.set(k, result);
    return result;
  };
  return ways(n);
}

/** Bottom-up DP with two rolling variables (the Fibonacci recurrence). O(n) time, O(1) space. */
export function climbStairsOptimal(n: number): number {
  let prev = 1; // ways(0)
  let curr = 1; // ways(1)
  for (let i = 2; i <= n; i++) [prev, curr] = [curr, prev + curr];
  return curr;
}

if (import.meta.main) {
  const tests: [number, number][] = [[1, 1], [2, 2], [3, 3], [4, 5], [5, 8], [10, 89], [45, 1836311903]];
  for (const [n, expected] of tests) {
    for (const fn of [climbStairsBetter, climbStairsOptimal]) {
      assert.equal(fn(n), expected, `${fn.name}(${n})`);
    }
  }
  // brute force only for small n (exponential)
  for (const [n, expected] of tests.slice(0, 5)) {
    assert.equal(climbStairsBruteForce(n), expected, `climbStairsBruteForce(${n})`);
  }
  console.log("All Climbing Stairs tests passed.");
}
