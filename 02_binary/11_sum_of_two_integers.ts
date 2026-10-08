/**
 * 11. Sum of Two Integers
 * LeetCode #371 | Difficulty: Medium | Category: Binary / Bit Manipulation
 *
 * Problem
 * -------
 * Given two integers `a` and `b`, return their sum without using the `+`
 * or `-` operators.
 *
 * Example
 * -------
 * Input: a = 1, b = 2
 * Output: 3
 *
 * Constraints
 * -----------
 * -1000 <= a, b <= 1000
 *
 * Approaches
 * ----------
 * 1. Brute force (`getSumBruteForce`) - Step `a` toward the answer one unit at
 *    a time while stepping `b` toward 0, using bitwise increment/decrement
 *    helpers so no `+`/`-` is used. O(|b|) time, O(1) space.
 * 2. Better (`getSumBetter`) - Bitwise addition one carry round at a time: XOR
 *    adds without carry, AND finds the carry bits, shift moves them one place
 *    left. Stops when there is no carry left. O(32) time, O(1) space.
 * 3. Optimal (`getSumOptimal`) - Same XOR/AND/shift loop, written tightly.
 *    JavaScript bitwise operators already work on 32-bit two's-complement
 *    integers, so negative numbers need no extra masking (unlike Python's
 *    arbitrary-precision ints). O(32) time, O(1) space.
 */
import assert from "node:assert/strict";

/** Increment `x` by one using only bit operations (ripple the carry). */
function increment(x: number): number {
  let carry = 1;
  while (carry !== 0) {
    const next = (x & carry) << 1;
    x ^= carry;
    carry = next;
  }
  return x;
}

/** Decrement `x` by one using only bit operations (ripple the borrow). */
function decrement(x: number): number {
  let borrow = 1;
  while (borrow !== 0) {
    const next = (~x & borrow) << 1;
    x ^= borrow;
    borrow = next;
  }
  return x;
}

/**
 * Step `a` toward the answer one unit at a time while stepping `b` toward 0,
 * using bitwise increment/decrement helpers so no `+`/`-` is used.
 * O(|b|) time, O(1) space.
 */
export function getSumBruteForce(a: number, b: number): number {
  while (b > 0) {
    a = increment(a);
    b = decrement(b);
  }
  while (b < 0) {
    a = decrement(a);
    b = increment(b);
  }
  return a;
}

/**
 * Bitwise addition one carry round at a time: XOR adds without carry, AND
 * finds the carry bits, shift moves them one place left. Stops when there
 * is no carry left. O(32) time, O(1) space.
 */
export function getSumBetter(a: number, b: number): number {
  let sum = a;
  let carry = b;
  while (carry !== 0) {
    const partial = sum ^ carry;
    carry = (sum & carry) << 1;
    sum = partial;
  }
  return sum;
}

/**
 * Same XOR/AND/shift loop, written tightly. JavaScript bitwise operators
 * already work on 32-bit two's-complement integers, so negative numbers
 * need no extra masking (unlike Python's arbitrary-precision ints).
 * O(32) time, O(1) space.
 */
export function getSumOptimal(a: number, b: number): number {
  while (b !== 0) {
    [a, b] = [a ^ b, (a & b) << 1];
  }
  return a;
}

if (import.meta.main) {
  const tests: [number, number, number][] = [
    [1, 2, 3],
    [2, 3, 5],
    [-1, 1, 0],
    [-2, -3, -5],
    [0, 0, 0],
    [1000, -1000, 0],
  ];
  for (const [a, b, expected] of tests) {
    assert.equal(getSumBetter(a, b), expected, `getSumBetter(${a}, ${b})`);
    assert.equal(getSumOptimal(a, b), expected, `getSumOptimal(${a}, ${b})`);
  }
  // brute force is slow for large |b|; only check small cases
  for (const [a, b, expected] of [[1, 2, 3], [5, -3, 2], [-4, 4, 0]]) {
    assert.equal(getSumBruteForce(a, b), expected, `getSumBruteForce(${a}, ${b})`);
  }
  console.log("All Sum of Two Integers tests passed.");
}
