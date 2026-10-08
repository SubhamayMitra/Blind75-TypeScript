/**
 * 53. Valid Anagram
 * LeetCode #242 | Difficulty: Easy | Category: String
 *
 * Problem
 * -------
 * Given two strings `s` and `t`, return true if `t` is an anagram of `s`
 * (uses exactly the same characters with the same frequencies).
 *
 * Example
 * -------
 * Input: s = "anagram", t = "nagaram"
 * Output: true
 *
 * Constraints
 * -----------
 * 1 <= s.length, t.length <= 5 * 10^4
 *
 * Approaches
 * ----------
 * 1. Brute force (`isAnagramBruteForce`) - For each char of s, find and remove
 *    one matching char from a copy of t. O(n^2) time, O(n) space.
 * 2. Better (`isAnagramBetter`) - Sort both strings and compare. O(n log n)
 *    time, O(n) space.
 * 3. Optimal (`isAnagramOptimal`) - Count letters with a 26-slot array: +1 for
 *    s, -1 for t; all counts must end at zero. O(n) time, O(1) space.
 */
import assert from "node:assert/strict";

/** For each char of s, find and remove one matching char from a copy of t. O(n^2) time, O(n) space. */
export function isAnagramBruteForce(s: string, t: string): boolean {
  if (s.length !== t.length) return false;
  const remaining = [...t];
  for (const ch of s) {
    const index = remaining.indexOf(ch);
    if (index === -1) return false;
    remaining.splice(index, 1);
  }
  return true;
}

/** Sort both strings and compare. O(n log n) time, O(n) space. */
export function isAnagramBetter(s: string, t: string): boolean {
  return s.length === t.length && [...s].sort().join("") === [...t].sort().join("");
}

/**
 * Count letters with a 26-slot array: +1 for s, -1 for t; all counts must
 * end at zero. O(n) time, O(1) space.
 */
export function isAnagramOptimal(s: string, t: string): boolean {
  if (s.length !== t.length) return false;
  const counts: number[] = new Array(26).fill(0);
  const a = "a".charCodeAt(0);
  for (let i = 0; i < s.length; i++) {
    counts[s.charCodeAt(i) - a]++;
    counts[t.charCodeAt(i) - a]--;
  }
  return counts.every((c) => c === 0);
}

if (import.meta.main) {
  const tests: [string, string, boolean][] = [
    ["anagram", "nagaram", true],
    ["rat", "car", false],
    ["a", "ab", false],
    ["", "", true],
  ];
  for (const [s, t, expected] of tests) {
    for (const fn of [isAnagramBruteForce, isAnagramBetter, isAnagramOptimal]) {
      assert.equal(fn(s, t), expected, `${fn.name}("${s}", "${t}")`);
    }
  }
  console.log("All Valid Anagram tests passed.");
}
