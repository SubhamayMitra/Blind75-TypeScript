/**
 * 17. Coin Change
 * LeetCode #322 | Difficulty: Medium | Category: Dynamic Programming
 *
 * Problem
 * -------
 * Given an array `coins` of coin denominations and an integer `amount`,
 * return the fewest number of coins needed to make up that amount. If it
 * cannot be made up, return -1. You have an infinite supply of each coin.
 *
 * Example
 * -------
 * Input: coins = [1, 2, 5], amount = 11
 * Output: 3           // 5 + 5 + 1
 *
 * Constraints
 * -----------
 * 1 <= coins.length <= 12, 0 <= amount <= 10^4
 *
 * Approaches
 * ----------
 * 1. Brute force (`coinChangeBruteForce`) - Recursively branch on every coin
 *    at every remaining amount. O(k^amount) time, O(amount) space.
 * 2. Better (`coinChangeBetter`) - Top-down recursion + memoization on the
 *    remaining amount. O(amount * k) time, O(amount) space.
 * 3. Optimal (`coinChangeOptimal`) - Bottom-up DP: dp[a] = fewest coins
 *    summing to a, with dp[0] = 0 and dp[a] = min(dp[a - coin] + 1). O(amount
 *    * k) time, O(amount) space.
 */
import assert from "node:assert/strict";

/** Recursively branch on every coin at every remaining amount. O(k^amount) time, O(amount) space. */
export function coinChangeBruteForce(coins: number[], amount: number): number {
  const solve = (remaining: number): number => {
    if (remaining === 0) return 0;
    if (remaining < 0) return Infinity;
    let best = Infinity;
    for (const coin of coins) best = Math.min(best, solve(remaining - coin) + 1);
    return best;
  };
  const result = solve(amount);
  return result === Infinity ? -1 : result;
}

/** Top-down recursion + memoization on the remaining amount. O(amount * k) time, O(amount) space. */
export function coinChangeBetter(coins: number[], amount: number): number {
  const memo = new Map<number, number>();
  const solve = (remaining: number): number => {
    if (remaining === 0) return 0;
    if (remaining < 0) return Infinity;
    const cached = memo.get(remaining);
    if (cached !== undefined) return cached;
    let best = Infinity;
    for (const coin of coins) best = Math.min(best, solve(remaining - coin) + 1);
    memo.set(remaining, best);
    return best;
  };
  const result = solve(amount);
  return result === Infinity ? -1 : result;
}

/**
 * Bottom-up DP: dp[a] = fewest coins summing to a, with dp[0] = 0 and
 * dp[a] = min(dp[a - coin] + 1). O(amount * k) time, O(amount) space.
 */
export function coinChangeOptimal(coins: number[], amount: number): number {
  const dp: number[] = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const coin of coins) {
      if (coin <= a && dp[a - coin] + 1 < dp[a]) dp[a] = dp[a - coin] + 1;
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}

if (import.meta.main) {
  const tests: [number[], number, number][] = [
    [[1, 2, 5], 11, 3],
    [[2], 3, -1],
    [[1], 0, 0],
    [[1, 3, 4, 5], 7, 2],
  ];
  for (const [coins, amount, expected] of tests) {
    for (const fn of [coinChangeBruteForce, coinChangeBetter, coinChangeOptimal]) {
      assert.equal(fn(coins, amount), expected, `${fn.name}(${JSON.stringify(coins)}, ${amount})`);
    }
  }
  console.log("All Coin Change tests passed.");
}
