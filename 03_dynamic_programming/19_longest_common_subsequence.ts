/**
 * 19. Longest Common Subsequence
 * LeetCode #1143 | Difficulty: Medium | Category: Dynamic Programming
 *
 * Problem
 * -------
 * Given two strings `text1` and `text2`, return the length of their
 * longest common subsequence (a sequence that appears in both strings in
 * the same relative order, not necessarily contiguous). Return 0 if there
 * is no common subsequence.
 *
 * Example
 * -------
 * Input: text1 = "abcde", text2 = "ace"
 * Output: 3           // "ace"
 *
 * Constraints
 * -----------
 * 1 <= text1.length, text2.length <= 1000
 *
 * Approaches
 * ----------
 * 1. Brute force (`lcsBruteForce`) - Recursively match the current characters
 *    or skip one from either string. O(2^(m+n)) time, O(m+n) space.
 * 2. Better (`lcsBetter`) - Top-down recursion + memoization on (i, j). O(m*n)
 *    time, O(m*n) space.
 * 3. Optimal (`lcsOptimal`) - Bottom-up DP rolled down to two rows, iterating
 *    over the shorter string for the row width. O(m*n) time, O(min(m, n))
 *    space.
 */
import assert from "node:assert/strict";

/** Recursively match the current characters or skip one from either string. O(2^(m+n)) time, O(m+n) space. */
export function lcsBruteForce(text1: string, text2: string): number {
  const solve = (i: number, j: number): number => {
    if (i === text1.length || j === text2.length) return 0;
    if (text1[i] === text2[j]) return 1 + solve(i + 1, j + 1);
    return Math.max(solve(i + 1, j), solve(i, j + 1));
  };
  return solve(0, 0);
}

/** Top-down recursion + memoization on (i, j). O(m*n) time, O(m*n) space. */
export function lcsBetter(text1: string, text2: string): number {
  const m = text1.length;
  const n = text2.length;
  const memo: number[][] = Array.from({ length: m }, () => new Array(n).fill(-1));
  const solve = (i: number, j: number): number => {
    if (i === m || j === n) return 0;
    if (memo[i][j] !== -1) return memo[i][j];
    memo[i][j] =
      text1[i] === text2[j] ? 1 + solve(i + 1, j + 1) : Math.max(solve(i + 1, j), solve(i, j + 1));
    return memo[i][j];
  };
  return solve(0, 0);
}

/**
 * Bottom-up DP rolled down to two rows, iterating over the shorter string
 * for the row width. O(m*n) time, O(min(m, n)) space.
 */
export function lcsOptimal(text1: string, text2: string): number {
  if (text2.length > text1.length) [text1, text2] = [text2, text1];
  const n = text2.length;
  let prev: number[] = new Array(n + 1).fill(0);
  for (let i = 1; i <= text1.length; i++) {
    const curr: number[] = new Array(n + 1).fill(0);
    for (let j = 1; j <= n; j++) {
      curr[j] = text1[i - 1] === text2[j - 1] ? prev[j - 1] + 1 : Math.max(prev[j], curr[j - 1]);
    }
    prev = curr;
  }
  return prev[n];
}

if (import.meta.main) {
  const tests: [string, string, number][] = [
    ["abcde", "ace", 3],
    ["abc", "abc", 3],
    ["abc", "def", 0],
    ["bsbininm", "jmjkbkjkv", 1],
  ];
  for (const [t1, t2, expected] of tests) {
    for (const fn of [lcsBruteForce, lcsBetter, lcsOptimal]) {
      assert.equal(fn(t1, t2), expected, `${fn.name}(${t1}, ${t2})`);
    }
  }
  console.log("All Longest Common Subsequence tests passed.");
}
