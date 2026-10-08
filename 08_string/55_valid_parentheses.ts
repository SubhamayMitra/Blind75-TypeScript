/**
 * 55. Valid Parentheses
 * LeetCode #20 | Difficulty: Easy | Category: String / Stack
 *
 * Problem
 * -------
 * Given a string `s` containing just the characters '(', ')', '{', '}',
 * '[' and ']', determine if the input string is valid: every opening
 * bracket must be closed by the same type of bracket, in the correct
 * order.
 *
 * Example
 * -------
 * Input: s = "()[]{}"
 * Output: true
 *
 * Constraints
 * -----------
 * 1 <= s.length <= 10^4
 *
 * Approaches
 * ----------
 * 1. Brute force (`isValidBruteForce`) - Repeatedly delete innermost "()",
 *    "[]", "{}" pairs; valid iff the string empties. O(n^2) time, O(n) space.
 * 2. Better (`isValidBetter`) - Stack-based matching with an explicit branch
 *    for each bracket type. O(n) time, O(n) space.
 * 3. Optimal (`isValidOptimal`) - Stack-based matching using a closing ->
 *    opening lookup table. O(n) time, O(n) space.
 */
import assert from "node:assert/strict";

/** Repeatedly delete innermost "()", "[]", "{}" pairs; valid iff the string empties. O(n^2) time, O(n) space. */
export function isValidBruteForce(s: string): boolean {
  let previous: string;
  do {
    previous = s;
    s = s.replaceAll("()", "").replaceAll("[]", "").replaceAll("{}", "");
  } while (s !== previous);
  return s.length === 0;
}

/** Stack-based matching with an explicit branch for each bracket type. O(n) time, O(n) space. */
export function isValidBetter(s: string): boolean {
  const stack: string[] = [];
  for (const ch of s) {
    if (ch === "(" || ch === "[" || ch === "{") {
      stack.push(ch);
    } else if (ch === ")") {
      if (stack.pop() !== "(") return false;
    } else if (ch === "]") {
      if (stack.pop() !== "[") return false;
    } else if (ch === "}") {
      if (stack.pop() !== "{") return false;
    }
  }
  return stack.length === 0;
}

const MATCHING: Record<string, string> = { ")": "(", "]": "[", "}": "{" };

/** Stack-based matching using a closing -> opening lookup table. O(n) time, O(n) space. */
export function isValidOptimal(s: string): boolean {
  if (s.length % 2 === 1) return false;
  const stack: string[] = [];
  for (const ch of s) {
    const open = MATCHING[ch];
    if (open === undefined) stack.push(ch);
    else if (stack.pop() !== open) return false;
  }
  return stack.length === 0;
}

if (import.meta.main) {
  const tests: [string, boolean][] = [
    ["()", true],
    ["()[]{}", true],
    ["(]", false],
    ["([)]", false],
    ["{[]}", true],
    ["]", false],
    ["((", false],
  ];
  for (const [s, expected] of tests) {
    for (const fn of [isValidBruteForce, isValidBetter, isValidOptimal]) {
      assert.equal(fn(s), expected, `${fn.name}("${s}")`);
    }
  }
  console.log("All Valid Parentheses tests passed.");
}
