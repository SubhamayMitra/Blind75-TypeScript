/**
 * 24. Decode Ways
 * LeetCode #91 | Difficulty: Medium | Category: Dynamic Programming
 *
 * Problem
 * -------
 * A message containing letters A-Z is encoded to numbers using the mapping
 * 'A' -> "1", 'B' -> "2", ..., 'Z' -> "26". Given a string `s` of digits,
 * return the number of ways to decode it. A leading '0' in any group makes
 * it invalid.
 *
 * Example
 * -------
 * Input: s = "226"
 * Output: 3           // "2 2 6", "22 6", "2 26"
 *
 * Constraints
 * -----------
 * 1 <= s.length <= 100, s consists of digits and may contain leading zeros.
 *
 * Approaches
 * ----------
 * 1. Brute force (`numDecodingsBruteForce`) - Recursively take 1 digit or 2
 *    digits at each position. O(2^n) time, O(n) space.
 * 2. Better (`numDecodingsBetter`) - Top-down recursion + memoization on the
 *    start index. O(n) time, O(n) space.
 * 3. Optimal (`numDecodingsOptimal`) - Bottom-up from the right with two
 *    rolling variables: ways(i) depends only on ways(i + 1) and ways(i + 2).
 *    O(n) time, O(1) space.
 */
import assert from "node:assert/strict";

/** True if s[i..i+1] is a valid two-digit code "10".."26". */
function isTwoDigitCode(s: string, i: number): boolean {
  return i + 1 < s.length && (s[i] === "1" || (s[i] === "2" && s[i + 1] <= "6"));
}

/** Recursively take 1 digit or 2 digits at each position. O(2^n) time, O(n) space. */
export function numDecodingsBruteForce(s: string): number {
  const solve = (i: number): number => {
    if (i === s.length) return 1;
    if (s[i] === "0") return 0;
    return solve(i + 1) + (isTwoDigitCode(s, i) ? solve(i + 2) : 0);
  };
  return solve(0);
}

/** Top-down recursion + memoization on the start index. O(n) time, O(n) space. */
export function numDecodingsBetter(s: string): number {
  const memo: number[] = new Array(s.length).fill(-1);
  const solve = (i: number): number => {
    if (i === s.length) return 1;
    if (s[i] === "0") return 0;
    if (memo[i] === -1) memo[i] = solve(i + 1) + (isTwoDigitCode(s, i) ? solve(i + 2) : 0);
    return memo[i];
  };
  return solve(0);
}

/**
 * Bottom-up from the right with two rolling variables: ways(i) depends only
 * on ways(i + 1) and ways(i + 2). O(n) time, O(1) space.
 */
export function numDecodingsOptimal(s: string): number {
  let next1 = 1; // ways(i + 1), starting with ways(n) = 1
  let next2 = 0; // ways(i + 2)
  for (let i = s.length - 1; i >= 0; i--) {
    const curr = s[i] === "0" ? 0 : next1 + (isTwoDigitCode(s, i) ? next2 : 0);
    [next1, next2] = [curr, next1];
  }
  return next1;
}

if (import.meta.main) {
  const tests: [string, number][] = [
    ["12", 2],
    ["226", 3],
    ["06", 0],
    ["0", 0],
    ["10", 1],
    ["2101", 1],
    ["27", 1],
  ];
  for (const [s, expected] of tests) {
    for (const fn of [numDecodingsBruteForce, numDecodingsBetter, numDecodingsOptimal]) {
      assert.equal(fn(s), expected, `${fn.name}(${s})`);
    }
  }
  console.log("All Decode Ways tests passed.");
}
