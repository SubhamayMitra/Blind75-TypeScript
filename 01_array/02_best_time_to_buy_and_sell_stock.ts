/**
 * 2. Best Time to Buy and Sell Stock
 * LeetCode #121 | Difficulty: Easy | Category: Array
 *
 * Problem
 * -------
 * You are given an array `prices` where prices[i] is the price of a stock on
 * day i. You want to maximize your profit by choosing a single day to buy
 * one stock and a different day in the future to sell that stock. Return
 * the maximum profit achievable, or 0 if no profit is possible.
 *
 * Example
 * -------
 * Input: prices = [7, 1, 5, 3, 6, 4]
 * Output: 5                      // buy at 1, sell at 6
 *
 * Constraints
 * -----------
 * 1 <= prices.length <= 10^5
 * 0 <= prices[i] <= 10^4
 *
 * Approaches
 * ----------
 * 1. Brute force (`maxProfitBruteForce`) - Try every buy/sell pair. O(n^2)
 *    time, O(1) space.
 * 2. Better (`maxProfitBetter`) - Precompute the minimum price seen up to each
 *    day, then scan once more for the best sale. O(n) time, O(n) space.
 * 3. Optimal (`maxProfitOptimal`) - Single pass tracking the running minimum
 *    and best profit. O(n) time, O(1) space.
 */
import assert from "node:assert/strict";

/** Try every buy/sell pair. O(n^2) time, O(1) space. */
export function maxProfitBruteForce(prices: number[]): number {
  let best = 0;
  for (let i = 0; i < prices.length; i++) {
    for (let j = i + 1; j < prices.length; j++) {
      best = Math.max(best, prices[j] - prices[i]);
    }
  }
  return best;
}

/**
 * Precompute the minimum price seen up to each day, then scan once more
 * for the best sale. O(n) time, O(n) space.
 */
export function maxProfitBetter(prices: number[]): number {
  if (prices.length === 0) return 0;
  const minSoFar: number[] = new Array(prices.length);
  minSoFar[0] = prices[0];
  for (let i = 1; i < prices.length; i++) minSoFar[i] = Math.min(minSoFar[i - 1], prices[i]);

  let best = 0;
  for (let i = 0; i < prices.length; i++) best = Math.max(best, prices[i] - minSoFar[i]);
  return best;
}

/** Single pass tracking the running minimum and best profit. O(n) time, O(1) space. */
export function maxProfitOptimal(prices: number[]): number {
  let minPrice = Infinity;
  let best = 0;
  for (const price of prices) {
    if (price < minPrice) minPrice = price;
    else best = Math.max(best, price - minPrice);
  }
  return best;
}

if (import.meta.main) {
  const tests: [number[], number][] = [
    [[7, 1, 5, 3, 6, 4], 5],
    [[7, 6, 4, 3, 1], 0],
    [[2, 4, 1], 2],
    [[1], 0],
  ];
  for (const [prices, expected] of tests) {
    for (const fn of [maxProfitBruteForce, maxProfitBetter, maxProfitOptimal]) {
      assert.equal(fn([...prices]), expected, `${fn.name}(${JSON.stringify(prices)})`);
    }
  }
  console.log("All Best Time to Buy and Sell Stock tests passed.");
}
