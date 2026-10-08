/**
 * 51. Longest Repeating Character Replacement
 * LeetCode #424 | Difficulty: Medium | Category: String / Sliding Window
 *
 * Problem
 * -------
 * Given a string `s` consisting of uppercase English letters and an
 * integer `k`, you can replace up to `k` characters with any other
 * uppercase letter. Return the length of the longest substring containing
 * the same letter after such replacements.
 *
 * Example
 * -------
 * Input: s = "AABABBA", k = 1
 * Output: 4           // replace the one 'B' at index 3 to get "AAAA"
 *
 * Constraints
 * -----------
 * 1 <= s.length <= 10^5, 0 <= k <= s.length
 *
 * Approaches
 * ----------
 * 1. Brute force (`characterReplacementBruteForce`) - For every start index,
 *    extend the end while tracking letter counts; a window is valid when
 *    (length - most frequent count) <= k. O(n^2 * 26) time, O(1) space.
 * 2. Better (`characterReplacementBetter`) - Sliding window that recomputes
 *    the max letter frequency from the 26 counts whenever it needs to check
 *    validity, shrinking until valid. O(26n) = O(n) time, O(1) space.
 * 3. Optimal (`characterReplacementOptimal`) - Sliding window that never
 *    shrinks: `maxFreq` only ever increases, since the answer can only improve
 *    when some letter's frequency beats it. An invalid window just slides
 *    right by one. O(n) time, O(1) space.
 */
import assert from "node:assert/strict";

const A = "A".charCodeAt(0);

/**
 * For every start index, extend the end while tracking letter counts; a
 * window is valid when (length - most frequent count) <= k.
 * O(n^2 * 26) time, O(1) space.
 */
export function characterReplacementBruteForce(s: string, k: number): number {
  let best = 0;
  for (let i = 0; i < s.length; i++) {
    const counts: number[] = new Array(26).fill(0);
    for (let j = i; j < s.length; j++) {
      counts[s.charCodeAt(j) - A]++;
      if (j - i + 1 - Math.max(...counts) <= k) best = Math.max(best, j - i + 1);
    }
  }
  return best;
}

/**
 * Sliding window that recomputes the max letter frequency from the 26
 * counts whenever it needs to check validity, shrinking until valid.
 * O(26n) = O(n) time, O(1) space.
 */
export function characterReplacementBetter(s: string, k: number): number {
  const counts: number[] = new Array(26).fill(0);
  let left = 0;
  let best = 0;
  for (let right = 0; right < s.length; right++) {
    counts[s.charCodeAt(right) - A]++;
    while (right - left + 1 - Math.max(...counts) > k) counts[s.charCodeAt(left++) - A]--;
    best = Math.max(best, right - left + 1);
  }
  return best;
}

/**
 * Sliding window that never shrinks: `maxFreq` only ever increases, since
 * the answer can only improve when some letter's frequency beats it. An
 * invalid window just slides right by one. O(n) time, O(1) space.
 */
export function characterReplacementOptimal(s: string, k: number): number {
  const counts: number[] = new Array(26).fill(0);
  let left = 0;
  let maxFreq = 0;
  for (let right = 0; right < s.length; right++) {
    maxFreq = Math.max(maxFreq, ++counts[s.charCodeAt(right) - A]);
    if (right - left + 1 - maxFreq > k) counts[s.charCodeAt(left++) - A]--;
  }
  return s.length - left;
}

if (import.meta.main) {
  const tests: [string, number, number][] = [
    ["ABAB", 2, 4],
    ["AABABBA", 1, 4],
    ["A", 0, 1],
    ["AAAA", 2, 4],
    ["ABCDE", 1, 2],
  ];
  for (const [s, k, expected] of tests) {
    for (const fn of [characterReplacementBruteForce, characterReplacementBetter, characterReplacementOptimal]) {
      assert.equal(fn(s, k), expected, `${fn.name}("${s}", ${k})`);
    }
  }
  console.log("All Longest Repeating Character Replacement tests passed.");
}
