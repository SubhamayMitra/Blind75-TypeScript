/**
 * 20. Word Break
 * LeetCode #139 | Difficulty: Medium | Category: Dynamic Programming
 *
 * Problem
 * -------
 * Given a string `s` and a dictionary of strings `wordDict`, return true if
 * `s` can be segmented into a space-separated sequence of one or more
 * dictionary words. Words may be reused any number of times.
 *
 * Example
 * -------
 * Input: s = "leetcode", wordDict = ["leet", "code"]
 * Output: true
 *
 * Constraints
 * -----------
 * 1 <= s.length <= 300, 1 <= wordDict.length <= 1000
 *
 * Approaches
 * ----------
 * 1. Brute force (`wordBreakBruteForce`) - Recursively try every prefix that
 *    is a dictionary word. O(2^n) time, O(n) space.
 * 2. Better (`wordBreakBetter`) - Top-down recursion + memoization on the
 *    start index. O(n^2) time, O(n) space.
 * 3. Optimal (`wordBreakOptimal`) - Bottom-up DP: dp[i] = can s[0..i) be
 *    segmented. dp[i] is true if some dictionary word ends at i and dp[i -
 *    word.length] is true. O(n * w * L) time (w words, max length L), O(n)
 *    space.
 */
import assert from "node:assert/strict";

/** Recursively try every prefix that is a dictionary word. O(2^n) time, O(n) space. */
export function wordBreakBruteForce(s: string, wordDict: string[]): boolean {
  const words = new Set(wordDict);
  const canBreak = (start: number): boolean => {
    if (start === s.length) return true;
    for (let end = start + 1; end <= s.length; end++) {
      if (words.has(s.slice(start, end)) && canBreak(end)) return true;
    }
    return false;
  };
  return canBreak(0);
}

/** Top-down recursion + memoization on the start index. O(n^2) time, O(n) space. */
export function wordBreakBetter(s: string, wordDict: string[]): boolean {
  const words = new Set(wordDict);
  const memo = new Map<number, boolean>();
  const canBreak = (start: number): boolean => {
    if (start === s.length) return true;
    const cached = memo.get(start);
    if (cached !== undefined) return cached;
    let result = false;
    for (let end = start + 1; end <= s.length && !result; end++) {
      result = words.has(s.slice(start, end)) && canBreak(end);
    }
    memo.set(start, result);
    return result;
  };
  return canBreak(0);
}

/**
 * Bottom-up DP: dp[i] = can s[0..i) be segmented. dp[i] is true if some
 * dictionary word ends at i and dp[i - word.length] is true.
 * O(n * w * L) time (w words, max length L), O(n) space.
 */
export function wordBreakOptimal(s: string, wordDict: string[]): boolean {
  const dp: boolean[] = new Array(s.length + 1).fill(false);
  dp[0] = true;
  for (let i = 1; i <= s.length; i++) {
    for (const word of wordDict) {
      const start = i - word.length;
      if (start >= 0 && dp[start] && s.startsWith(word, start)) {
        dp[i] = true;
        break;
      }
    }
  }
  return dp[s.length];
}

if (import.meta.main) {
  const tests: [string, string[], boolean][] = [
    ["leetcode", ["leet", "code"], true],
    ["applepenapple", ["apple", "pen"], true],
    ["catsandog", ["cats", "dog", "sand", "and", "cat"], false],
  ];
  for (const [s, wordDict, expected] of tests) {
    for (const fn of [wordBreakBruteForce, wordBreakBetter, wordBreakOptimal]) {
      assert.equal(fn(s, wordDict), expected, `${fn.name}(${s})`);
    }
  }
  console.log("All Word Break tests passed.");
}
