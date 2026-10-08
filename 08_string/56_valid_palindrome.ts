/**
 * 56. Valid Palindrome
 * LeetCode #125 | Difficulty: Easy | Category: String / Two Pointers
 *
 * Problem
 * -------
 * Given a string `s`, return true if it is a palindrome after converting
 * all uppercase letters to lowercase and removing all non-alphanumeric
 * characters.
 *
 * Example
 * -------
 * Input: s = "A man, a plan, a canal: Panama"
 * Output: true
 *
 * Constraints
 * -----------
 * 1 <= s.length <= 2 * 10^5
 *
 * Approaches
 * ----------
 * 1. Brute force (`isPalindromeBruteForce`) - Build the cleaned lowercase
 *    string and compare it with its reverse. O(n) time, O(n) space.
 * 2. Better (`isPalindromeBetter`) - Build the cleaned string, then walk two
 *    pointers inward over it. O(n) time, O(n) space.
 * 3. Optimal (`isPalindromeOptimal`) - Two pointers on the original string,
 *    skipping non-alphanumerics on the fly. O(n) time, O(1) extra space.
 */
import assert from "node:assert/strict";

const isAlphanumeric = (ch: string): boolean => /[a-z0-9]/i.test(ch);

/** Build the cleaned lowercase string and compare it with its reverse. O(n) time, O(n) space. */
export function isPalindromeBruteForce(s: string): boolean {
  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, "");
  return cleaned === [...cleaned].reverse().join("");
}

/** Build the cleaned string, then walk two pointers inward over it. O(n) time, O(n) space. */
export function isPalindromeBetter(s: string): boolean {
  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, "");
  for (let i = 0, j = cleaned.length - 1; i < j; i++, j--) {
    if (cleaned[i] !== cleaned[j]) return false;
  }
  return true;
}

/** Two pointers on the original string, skipping non-alphanumerics on the fly. O(n) time, O(1) extra space. */
export function isPalindromeOptimal(s: string): boolean {
  let i = 0;
  let j = s.length - 1;
  while (i < j) {
    if (!isAlphanumeric(s[i])) i++;
    else if (!isAlphanumeric(s[j])) j--;
    else if (s[i++].toLowerCase() !== s[j--].toLowerCase()) return false;
  }
  return true;
}

if (import.meta.main) {
  const tests: [string, boolean][] = [
    ["A man, a plan, a canal: Panama", true],
    ["race a car", false],
    [" ", true],
    ["0P", false],
  ];
  for (const [s, expected] of tests) {
    for (const fn of [isPalindromeBruteForce, isPalindromeBetter, isPalindromeOptimal]) {
      assert.equal(fn(s), expected, `${fn.name}("${s}")`);
    }
  }
  console.log("All Valid Palindrome tests passed.");
}
