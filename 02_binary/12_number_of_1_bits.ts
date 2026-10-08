/**
 * 12. Number of 1 Bits (Hamming Weight)
 * LeetCode #191 | Difficulty: Easy | Category: Binary / Bit Manipulation
 *
 * Problem
 * -------
 * Given an unsigned 32-bit integer `n`, return the number of '1' bits it
 * has (the Hamming weight).
 *
 * Example
 * -------
 * Input: n = 11 (binary 1011)
 * Output: 3
 *
 * Constraints
 * -----------
 * 0 <= n <= 2^32 - 1
 *
 * Approaches
 * ----------
 * 1. Brute force (`hammingWeightBruteForce`) - Check each of the 32 bit
 *    positions with shift + mask. O(32) time, O(1) space.
 * 2. Better (`hammingWeightBetter`) - Convert to a binary string and count the
 *    '1' characters. O(32) time, O(32) space.
 * 3. Optimal (`hammingWeightOptimal`) - Brian Kernighan's trick: n & (n - 1)
 *    clears the lowest set bit, so loop only as many times as there are 1
 *    bits. O(k) time (k = set bits), O(1) space.
 */
import assert from "node:assert/strict";

/** Check each of the 32 bit positions with shift + mask. O(32) time, O(1) space. */
export function hammingWeightBruteForce(n: number): number {
  let count = 0;
  for (let i = 0; i < 32; i++) {
    if ((n >>> i) & 1) count++;
  }
  return count;
}

/** Convert to a binary string and count the '1' characters. O(32) time, O(32) space. */
export function hammingWeightBetter(n: number): number {
  let count = 0;
  for (const ch of (n >>> 0).toString(2)) {
    if (ch === "1") count++;
  }
  return count;
}

/**
 * Brian Kernighan's trick: n & (n - 1) clears the lowest set bit, so loop
 * only as many times as there are 1 bits. O(k) time (k = set bits), O(1) space.
 */
export function hammingWeightOptimal(n: number): number {
  let count = 0;
  while (n !== 0) {
    n &= n - 1;
    count++;
  }
  return count;
}

if (import.meta.main) {
  const tests: [number, number][] = [
    [11, 3],
    [128, 1],
    [4294967293, 31], // 0b11111111111111111111111111111101
    [0, 0],
  ];
  for (const [n, expected] of tests) {
    for (const fn of [hammingWeightBruteForce, hammingWeightBetter, hammingWeightOptimal]) {
      assert.equal(fn(n), expected, `${fn.name}(${n})`);
    }
  }
  console.log("All Number of 1 Bits tests passed.");
}
