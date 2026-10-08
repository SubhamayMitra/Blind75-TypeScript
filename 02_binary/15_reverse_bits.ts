/**
 * 15. Reverse Bits
 * LeetCode #190 | Difficulty: Easy | Category: Binary / Bit Manipulation
 *
 * Problem
 * -------
 * Reverse the bits of a given 32-bit unsigned integer.
 *
 * Example
 * -------
 * Input:  n = 00000010100101000001111010011100 (binary, 32 bits)
 * Output:    00111001011110000010100101000000 (binary, 32 bits)
 *
 * Constraints
 * -----------
 * The input is a 32-bit unsigned integer.
 *
 * Approaches
 * ----------
 * 1. Brute force (`reverseBitsBruteForce`) - Build the 32-char binary string,
 *    reverse it, parse it back. O(32) time, O(32) space.
 * 2. Better (`reverseBitsBetter`) - Peel bits off the right of n one at a time
 *    and push them onto the right of the result: result = (result << 1) | bit.
 *    `>>> 0` keeps the value unsigned. O(32) time, O(1) space.
 * 3. Optimal (`reverseBitsOptimal`) - Divide-and-conquer swaps: swap the
 *    16-bit halves, then bytes within each half, nibbles, bit pairs, and
 *    finally single bits. Five masked shifts, independent of the input. O(1)
 *    time, O(1) space.
 */
import assert from "node:assert/strict";

/** Build the 32-char binary string, reverse it, parse it back. O(32) time, O(32) space. */
export function reverseBitsBruteForce(n: number): number {
  const bits = (n >>> 0).toString(2).padStart(32, "0");
  return parseInt([...bits].reverse().join(""), 2);
}

/**
 * Peel bits off the right of n one at a time and push them onto the right
 * of the result: result = (result << 1) | bit. `>>> 0` keeps the value
 * unsigned. O(32) time, O(1) space.
 */
export function reverseBitsBetter(n: number): number {
  let result = 0;
  for (let i = 0; i < 32; i++) {
    result = ((result << 1) | (n & 1)) >>> 0;
    n >>>= 1;
  }
  return result;
}

/**
 * Divide-and-conquer swaps: swap the 16-bit halves, then bytes within each
 * half, nibbles, bit pairs, and finally single bits. Five masked shifts,
 * independent of the input. O(1) time, O(1) space.
 */
export function reverseBitsOptimal(n: number): number {
  n = ((n >>> 16) | (n << 16)) >>> 0;
  n = (((n & 0xff00ff00) >>> 8) | ((n & 0x00ff00ff) << 8)) >>> 0;
  n = (((n & 0xf0f0f0f0) >>> 4) | ((n & 0x0f0f0f0f) << 4)) >>> 0;
  n = (((n & 0xcccccccc) >>> 2) | ((n & 0x33333333) << 2)) >>> 0;
  n = (((n & 0xaaaaaaaa) >>> 1) | ((n & 0x55555555) << 1)) >>> 0;
  return n;
}

if (import.meta.main) {
  const tests: [number, number][] = [
    [43261596, 964176192],
    [4294967293, 3221225471],
    [0, 0],
    [1, 2 ** 31],
  ];
  for (const [n, expected] of tests) {
    for (const fn of [reverseBitsBruteForce, reverseBitsBetter, reverseBitsOptimal]) {
      assert.equal(fn(n >>> 0), expected, `${fn.name}(${n})`);
    }
  }
  console.log("All Reverse Bits tests passed.");
}
