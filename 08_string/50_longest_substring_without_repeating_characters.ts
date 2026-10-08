/**
 * 50. Longest Substring Without Repeating Characters
 * LeetCode #3 | Difficulty: Medium | Category: String / Sliding Window
 *
 * Problem
 * -------
 * Given a string `s`, find the length of the longest substring without
 * repeating characters.
 *
 * Example
 * -------
 * Input: s = "abcabcbb"
 * Output: 3           // "abc"
 *
 * Constraints
 * -----------
 * 0 <= s.length <= 5 * 10^4
 *
 * Approaches
 * ----------
 * 1. Brute force (`lengthOfLongestSubstringBruteForce`) - Check every
 *    substring for uniqueness. O(n^3) time, O(min(n, alphabet)) space.
 * 2. Better (`lengthOfLongestSubstringBetter`) - Sliding window with a Set of
 *    the window's characters; on a duplicate, shrink from the left one
 *    character at a time until it is gone. O(n) time (each char enters and
 *    leaves once), O(min(n, alphabet)) space.
 * 3. Optimal (`lengthOfLongestSubstringOptimal`) - Sliding window with a Map
 *    from char -> last index seen, so the left edge jumps straight past the
 *    previous occurrence in one step. O(n) time, O(min(n, alphabet)) space.
 */
import assert from "node:assert/strict";

/** Check every substring for uniqueness. O(n^3) time, O(min(n, alphabet)) space. */
export function lengthOfLongestSubstringBruteForce(s: string): number {
  let best = 0;
  for (let i = 0; i < s.length; i++) {
    for (let j = i + 1; j <= s.length; j++) {
      const sub = s.slice(i, j);
      if (new Set(sub).size === sub.length) best = Math.max(best, sub.length);
    }
  }
  return best;
}

/**
 * Sliding window with a Set of the window's characters; on a duplicate,
 * shrink from the left one character at a time until it is gone.
 * O(n) time (each char enters and leaves once), O(min(n, alphabet)) space.
 */
export function lengthOfLongestSubstringBetter(s: string): number {
  const window = new Set<string>();
  let left = 0;
  let best = 0;
  for (let right = 0; right < s.length; right++) {
    while (window.has(s[right])) window.delete(s[left++]);
    window.add(s[right]);
    best = Math.max(best, right - left + 1);
  }
  return best;
}

/**
 * Sliding window with a Map from char -> last index seen, so the left edge
 * jumps straight past the previous occurrence in one step.
 * O(n) time, O(min(n, alphabet)) space.
 */
export function lengthOfLongestSubstringOptimal(s: string): number {
  const lastSeen = new Map<string, number>();
  let left = 0;
  let best = 0;
  for (let right = 0; right < s.length; right++) {
    const prev = lastSeen.get(s[right]);
    if (prev !== undefined && prev >= left) left = prev + 1;
    lastSeen.set(s[right], right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}

if (import.meta.main) {
  const tests: [string, number][] = [
    ["abcabcbb", 3],
    ["bbbbb", 1],
    ["pwwkew", 3],
    ["", 0],
    [" ", 1],
    ["abba", 2],
  ];
  for (const [s, expected] of tests) {
    for (const fn of [lengthOfLongestSubstringBruteForce, lengthOfLongestSubstringBetter, lengthOfLongestSubstringOptimal]) {
      assert.equal(fn(s), expected, `${fn.name}("${s}")`);
    }
  }
  console.log("All Longest Substring Without Repeating Characters tests passed.");
}
