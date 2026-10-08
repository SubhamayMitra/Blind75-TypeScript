/**
 * 58. Palindromic Substrings
 * LeetCode #647 | Difficulty: Medium | Category: String
 *
 * Problem
 * -------
 * Given a string `s`, return the number of palindromic substrings in it
 * (substrings that read the same forwards and backwards; different
 * positions count as different substrings even if the text is the same).
 *
 * Example
 * -------
 * Input: s = "aaa"
 * Output: 6           // "a", "a", "a", "aa", "aa", "aaa"
 *
 * Constraints
 * -----------
 * 1 <= s.length <= 1000
 *
 * Approaches
 * ----------
 * 1. Brute force (`countSubstringsBruteForce`) - Check every substring for
 *    being a palindrome. O(n^3) time, O(1) extra space.
 * 2. Better (`countSubstringsDp`) - dp[i][j] = s[i..j] is a palindrome; count
 *    every true entry. O(n^2) time, O(n^2) space.
 * 3. Optimal (`countSubstringsOptimal`) - Expand around each of the 2n - 1
 *    centres, counting one palindrome per successful expansion step. O(n^2)
 *    time, O(1) extra space.
 */
import assert from "node:assert/strict";

/** Check every substring for being a palindrome. O(n^3) time, O(1) extra space. */
export function countSubstringsBruteForce(s: string): number {
  let count = 0;
  for (let i = 0; i < s.length; i++) {
    for (let j = i; j < s.length; j++) {
      let lo = i;
      let hi = j;
      while (lo < hi && s[lo] === s[hi]) {
        lo++;
        hi--;
      }
      if (lo >= hi) count++;
    }
  }
  return count;
}

/** dp[i][j] = s[i..j] is a palindrome; count every true entry. O(n^2) time, O(n^2) space. */
export function countSubstringsDp(s: string): number {
  const n = s.length;
  const dp: boolean[][] = Array.from({ length: n }, () => new Array(n).fill(false));
  let count = 0;
  for (let i = n - 1; i >= 0; i--) {
    for (let j = i; j < n; j++) {
      if (s[i] === s[j] && (j - i < 2 || dp[i + 1][j - 1])) {
        dp[i][j] = true;
        count++;
      }
    }
  }
  return count;
}

/**
 * Expand around each of the 2n - 1 centres, counting one palindrome per
 * successful expansion step. O(n^2) time, O(1) extra space.
 */
export function countSubstringsOptimal(s: string): number {
  let count = 0;
  for (let center = 0; center < 2 * s.length - 1; center++) {
    let lo = center >> 1;
    let hi = lo + (center % 2);
    while (lo >= 0 && hi < s.length && s[lo] === s[hi]) {
      count++;
      lo--;
      hi++;
    }
  }
  return count;
}

if (import.meta.main) {
  const tests: [string, number][] = [
    ["abc", 3],
    ["aaa", 6],
    ["a", 1],
    ["aba", 4],
  ];
  for (const [s, expected] of tests) {
    for (const fn of [countSubstringsBruteForce, countSubstringsDp, countSubstringsOptimal]) {
      assert.equal(fn(s), expected, `${fn.name}("${s}")`);
    }
  }
  console.log("All Palindromic Substrings tests passed.");
}
