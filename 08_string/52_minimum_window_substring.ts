/**
 * 52. Minimum Window Substring
 * LeetCode #76 | Difficulty: Hard | Category: String / Sliding Window
 *
 * Problem
 * -------
 * Given two strings `s` and `t`, return the minimum window substring of
 * `s` such that every character in `t` (including duplicates) is included
 * in the window. Return "" if no such substring exists.
 *
 * Example
 * -------
 * Input: s = "ADOBECODEBANC", t = "ABC"
 * Output: "BANC"
 *
 * Constraints
 * -----------
 * 1 <= s.length, t.length <= 10^5
 *
 * Approaches
 * ----------
 * 1. Brute force (`minWindowBruteForce`) - For each start, grow the end until
 *    the substring covers t (keeping a running count for that start). The
 *    first covering end is the shortest for that start. O(n^2 * k) time, O(k)
 *    space.
 * 2. Better (`minWindowBetter`) - Sliding window, but validity is re-checked
 *    by comparing the full count maps (`covers`) after every move instead of
 *    keeping a running tally. O(n * k) time, O(k) space (k = distinct chars in
 *    t).
 * 3. Optimal (`minWindowOptimal`) - Sliding window with a running `have`
 *    counter of how many distinct required characters currently meet their
 *    quota, updated in O(1) per expand/shrink step. O(n + m) time, O(k) space.
 */
import assert from "node:assert/strict";

function countChars(str: string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const ch of str) counts.set(ch, (counts.get(ch) ?? 0) + 1);
  return counts;
}

/** True if `window` contains every character of `need` with at least the required multiplicity. */
function covers(window: Map<string, number>, need: Map<string, number>): boolean {
  for (const [ch, count] of need) if ((window.get(ch) ?? 0) < count) return false;
  return true;
}

/**
 * For each start, grow the end until the substring covers t (keeping a
 * running count for that start). The first covering end is the shortest
 * for that start. O(n^2 * k) time, O(k) space.
 */
export function minWindowBruteForce(s: string, t: string): string {
  const need = countChars(t);
  let best = "";
  for (let i = 0; i < s.length; i++) {
    const window = new Map<string, number>();
    for (let j = i; j < s.length; j++) {
      window.set(s[j], (window.get(s[j]) ?? 0) + 1);
      if (covers(window, need)) {
        if (best === "" || j - i + 1 < best.length) best = s.slice(i, j + 1);
        break;
      }
    }
  }
  return best;
}

/**
 * Sliding window, but validity is re-checked by comparing the full count
 * maps (`covers`) after every move instead of keeping a running tally.
 * O(n * k) time, O(k) space (k = distinct chars in t).
 */
export function minWindowBetter(s: string, t: string): string {
  const need = countChars(t);
  const window = new Map<string, number>();
  let best: [number, number] | null = null;
  let left = 0;
  for (let right = 0; right < s.length; right++) {
    window.set(s[right], (window.get(s[right]) ?? 0) + 1);
    while (covers(window, need)) {
      if (!best || right - left < best[1] - best[0]) best = [left, right];
      window.set(s[left], window.get(s[left])! - 1);
      left++;
    }
  }
  return best ? s.slice(best[0], best[1] + 1) : "";
}

/**
 * Sliding window with a running `have` counter of how many distinct
 * required characters currently meet their quota, updated in O(1) per
 * expand/shrink step. O(n + m) time, O(k) space.
 */
export function minWindowOptimal(s: string, t: string): string {
  if (t.length === 0) return "";
  const need = countChars(t);
  const window = new Map<string, number>();
  const required = need.size;
  let have = 0;
  let bestStart = 0;
  let bestLen = Infinity;
  let left = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    const count = (window.get(ch) ?? 0) + 1;
    window.set(ch, count);
    if (count === need.get(ch)) have++;

    while (have === required) {
      if (right - left + 1 < bestLen) {
        bestStart = left;
        bestLen = right - left + 1;
      }
      const out = s[left++];
      const outCount = window.get(out)! - 1;
      window.set(out, outCount);
      if (need.has(out) && outCount < need.get(out)!) have--;
    }
  }
  return bestLen === Infinity ? "" : s.slice(bestStart, bestStart + bestLen);
}

if (import.meta.main) {
  const tests: [string, string, string][] = [
    ["ADOBECODEBANC", "ABC", "BANC"],
    ["a", "a", "a"],
    ["a", "aa", ""],
    ["aa", "aa", "aa"],
  ];
  for (const [s, t, expected] of tests) {
    for (const fn of [minWindowBruteForce, minWindowBetter, minWindowOptimal]) {
      assert.equal(fn(s, t), expected, `${fn.name}("${s}", "${t}")`);
    }
  }
  console.log("All Minimum Window Substring tests passed.");
}
