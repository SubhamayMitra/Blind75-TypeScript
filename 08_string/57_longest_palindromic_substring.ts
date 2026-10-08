/**
 * 57. Longest Palindromic Substring
 * LeetCode #5 | Difficulty: Medium | Category: String
 *
 * Problem
 * -------
 * Given a string `s`, return the longest palindromic substring in `s`.
 *
 * Example
 * -------
 * Input: s = "babad"
 * Output: "bab"       // ("aba" is also a valid answer)
 *
 * Constraints
 * -----------
 * 1 <= s.length <= 1000
 *
 * Approaches
 * ----------
 * 1. Brute force (`longestPalindromeBruteForce`) - Check every substring for
 *    being a palindrome. O(n^3) time, O(1) extra space.
 * 2. Better (`longestPalindromeDp`) - dp[i][j] = s[i..j] is a palindrome, true
 *    when the ends match and the inside (dp[i+1][j-1]) is a palindrome. Fill
 *    by increasing length. O(n^2) time, O(n^2) space.
 * 3. Optimal (`longestPalindromeOptimal`) - Expand around each of the 2n - 1
 *    centres (a character, or the gap between two) while the ends match.
 *    O(n^2) time, O(1) extra space.
 */
import assert from "node:assert/strict";

function isPalindrome(s: string, i: number, j: number): boolean {
  while (i < j) if (s[i++] !== s[j--]) return false;
  return true;
}

/** Check every substring for being a palindrome. O(n^3) time, O(1) extra space. */
export function longestPalindromeBruteForce(s: string): string {
  let best = "";
  for (let i = 0; i < s.length; i++) {
    for (let j = i + best.length; j < s.length; j++) {
      if (isPalindrome(s, i, j)) best = s.slice(i, j + 1);
    }
  }
  return best;
}

/**
 * dp[i][j] = s[i..j] is a palindrome, true when the ends match and the
 * inside (dp[i+1][j-1]) is a palindrome. Fill by increasing length.
 * O(n^2) time, O(n^2) space.
 */
export function longestPalindromeDp(s: string): string {
  const n = s.length;
  const dp: boolean[][] = Array.from({ length: n }, () => new Array(n).fill(false));
  let start = 0;
  let maxLen = n > 0 ? 1 : 0;
  for (let i = 0; i < n; i++) dp[i][i] = true;
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      if (s[i] === s[j] && (len === 2 || dp[i + 1][j - 1])) {
        dp[i][j] = true;
        if (len > maxLen) {
          start = i;
          maxLen = len;
        }
      }
    }
  }
  return s.slice(start, start + maxLen);
}

/**
 * Expand around each of the 2n - 1 centres (a character, or the gap
 * between two) while the ends match. O(n^2) time, O(1) extra space.
 */
export function longestPalindromeOptimal(s: string): string {
  let start = 0;
  let maxLen = 0;
  const expand = (lo: number, hi: number): void => {
    while (lo >= 0 && hi < s.length && s[lo] === s[hi]) {
      lo--;
      hi++;
    }
    if (hi - lo - 1 > maxLen) {
      start = lo + 1;
      maxLen = hi - lo - 1;
    }
  };
  for (let i = 0; i < s.length; i++) {
    expand(i, i);
    expand(i, i + 1);
  }
  return s.slice(start, start + maxLen);
}

if (import.meta.main) {
  const tests: [string, string[]][] = [
    ["babad", ["bab", "aba"]],
    ["cbbd", ["bb"]],
    ["a", ["a"]],
    ["ac", ["a", "c"]],
    ["forgeeksskeegfor", ["geeksskeeg"]],
  ];
  for (const [s, candidates] of tests) {
    for (const fn of [longestPalindromeBruteForce, longestPalindromeDp, longestPalindromeOptimal]) {
      const result = fn(s);
      assert.ok(candidates.includes(result), `${fn.name}("${s}") -> "${result}"`);
    }
  }
  console.log("All Longest Palindromic Substring tests passed.");
}
