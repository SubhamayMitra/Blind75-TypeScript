/**
 * 54. Group Anagrams
 * LeetCode #49 | Difficulty: Medium | Category: String
 *
 * Problem
 * -------
 * Given an array of strings `strs`, group the anagrams together. You can
 * return the answer in any order.
 *
 * Example
 * -------
 * Input: strs = ["eat","tea","tan","ate","nat","bat"]
 * Output: [["bat"],["nat","tan"],["ate","eat","tea"]]
 *
 * Constraints
 * -----------
 * 1 <= strs.length <= 10^4
 *
 * Approaches
 * ----------
 * 1. Brute force (`groupAnagramsBruteForce`) - Compare each string against
 *    every existing group's representative by sorting both. O(n^2 * k log k)
 *    time, O(n*k) space (k = max string length).
 * 2. Better (`groupAnagramsBetter`) - Map keyed by the sorted string (a
 *    canonical form per anagram group). O(n * k log k) time, O(n*k) space.
 * 3. Optimal (`groupAnagramsOptimal`) - Map keyed by the 26-letter count
 *    signature, avoiding the sort. O(n * k) time, O(n*k) space.
 */
import assert from "node:assert/strict";

const sortChars = (s: string): string => [...s].sort().join("");

/**
 * Compare each string against every existing group's representative by
 * sorting both. O(n^2 * k log k) time, O(n*k) space (k = max string length).
 */
export function groupAnagramsBruteForce(strs: string[]): string[][] {
  const groups: string[][] = [];
  for (const s of strs) {
    const key = sortChars(s);
    const group = groups.find((g) => sortChars(g[0]) === key);
    if (group) group.push(s);
    else groups.push([s]);
  }
  return groups;
}

/** Map keyed by the sorted string (a canonical form per anagram group). O(n * k log k) time, O(n*k) space. */
export function groupAnagramsBetter(strs: string[]): string[][] {
  const groups = new Map<string, string[]>();
  for (const s of strs) {
    const key = sortChars(s);
    const group = groups.get(key);
    if (group) group.push(s);
    else groups.set(key, [s]);
  }
  return [...groups.values()];
}

/**
 * Map keyed by the 26-letter count signature, avoiding the sort.
 * O(n * k) time, O(n*k) space.
 */
export function groupAnagramsOptimal(strs: string[]): string[][] {
  const groups = new Map<string, string[]>();
  const a = "a".charCodeAt(0);
  for (const s of strs) {
    const counts: number[] = new Array(26).fill(0);
    for (let i = 0; i < s.length; i++) counts[s.charCodeAt(i) - a]++;
    const key = counts.join("#");
    const group = groups.get(key);
    if (group) group.push(s);
    else groups.set(key, [s]);
  }
  return [...groups.values()];
}

function normalize(groups: string[][]): string[] {
  return groups.map((g) => [...g].sort().join(",")).sort();
}

if (import.meta.main) {
  const tests: [string[], string[][]][] = [
    [["eat", "tea", "tan", "ate", "nat", "bat"], [["bat"], ["nat", "tan"], ["ate", "eat", "tea"]]],
    [[""], [[""]]],
    [["a"], [["a"]]],
  ];
  for (const [strs, expected] of tests) {
    for (const fn of [groupAnagramsBruteForce, groupAnagramsBetter, groupAnagramsOptimal]) {
      assert.deepEqual(normalize(fn([...strs])), normalize(expected), `${fn.name}(${JSON.stringify(strs)})`);
    }
  }
  console.log("All Group Anagrams tests passed.");
}
