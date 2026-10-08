/**
 * 13. Counting Bits
 * LeetCode #338 | Difficulty: Easy | Category: Binary / Dynamic Programming
 *
 * Problem
 * -------
 * Given an integer `n`, return an array `ans` of length n + 1 such that for
 * each i (0 <= i <= n), ans[i] is the number of 1 bits in the binary
 * representation of i.
 *
 * Example
 * -------
 * Input: n = 5
 * Output: [0, 1, 1, 2, 1, 2]     // 0, 1, 10, 11, 100, 101 in binary
 *
 * Constraints
 * -----------
 * 0 <= n <= 10^5
 *
 * Approaches
 * ----------
 * 1. Brute force (`countBitsBruteForce`) - Count bits of each i independently
 *    with Kernighan's trick. O(n log n) time, O(n) space.
 * 2. Better (`countBitsBetter`) - DP on the "last set bit": ans[i] = ans[i &
 *    (i - 1)] + 1. O(n) time, O(n) space.
 * 3. Optimal (`countBitsOptimal`) - DP on the "least significant bit": ans[i]
 *    = ans[i >> 1] + (i & 1). O(n) time, O(n) space.
 */
import assert from "node:assert/strict";

/** Count bits of each i independently with Kernighan's trick. O(n log n) time, O(n) space. */
export function countBitsBruteForce(n: number): number[] {
  const ans: number[] = [];
  for (let i = 0; i <= n; i++) {
    let x = i;
    let count = 0;
    while (x !== 0) {
      x &= x - 1;
      count++;
    }
    ans.push(count);
  }
  return ans;
}

/** DP on the "last set bit": ans[i] = ans[i & (i - 1)] + 1. O(n) time, O(n) space. */
export function countBitsBetter(n: number): number[] {
  const ans: number[] = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) ans[i] = ans[i & (i - 1)] + 1;
  return ans;
}

/** DP on the "least significant bit": ans[i] = ans[i >> 1] + (i & 1). O(n) time, O(n) space. */
export function countBitsOptimal(n: number): number[] {
  const ans: number[] = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) ans[i] = ans[i >> 1] + (i & 1);
  return ans;
}

if (import.meta.main) {
  const tests: [number, number[]][] = [
    [2, [0, 1, 1]],
    [5, [0, 1, 1, 2, 1, 2]],
    [0, [0]],
  ];
  for (const [n, expected] of tests) {
    for (const fn of [countBitsBruteForce, countBitsBetter, countBitsOptimal]) {
      assert.deepEqual(fn(n), expected, `${fn.name}(${n})`);
    }
  }
  console.log("All Counting Bits tests passed.");
}
