/**
 * 9. 3Sum
 * LeetCode #15 | Difficulty: Medium | Category: Array
 *
 * Problem
 * -------
 * Given an integer array `nums`, return all unique triplets
 * [nums[i], nums[j], nums[k]] (i != j != k) such that they sum to 0. The
 * solution set must not contain duplicate triplets.
 *
 * Example
 * -------
 * Input: nums = [-1, 0, 1, 2, -1, -4]
 * Output: [[-1, -1, 2], [-1, 0, 1]]
 *
 * Constraints
 * -----------
 * 3 <= nums.length <= 3000
 *
 * Approaches
 * ----------
 * 1. Brute force (`threeSumBruteForce`) - Three nested loops; sort each
 *    triplet and dedupe via a string-keyed set. O(n^3) time, O(n) space.
 * 2. Better (`threeSumBetter`) - Fix i, then find pairs summing to -nums[i]
 *    with a hash set (Two Sum). O(n^2) time, O(n) space.
 * 3. Optimal (`threeSumOptimal`) - Sort once, fix i, then move two pointers
 *    inward, skipping duplicates so no dedupe set is needed. O(n^2) time, O(1)
 *    extra space (besides sorting/output).
 */
import assert from "node:assert/strict";

/** Three nested loops; sort each triplet and dedupe via a string-keyed set. O(n^3) time, O(n) space. */
export function threeSumBruteForce(nums: number[]): number[][] {
  const seen = new Set<string>();
  const result: number[][] = [];
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let k = j + 1; k < n; k++) {
        if (nums[i] + nums[j] + nums[k] !== 0) continue;
        const triplet = [nums[i], nums[j], nums[k]].sort((a, b) => a - b);
        const key = triplet.join(",");
        if (!seen.has(key)) {
          seen.add(key);
          result.push(triplet);
        }
      }
    }
  }
  return result;
}

/**
 * Fix i, then find pairs summing to -nums[i] with a hash set (Two Sum).
 * O(n^2) time, O(n) space.
 */
export function threeSumBetter(nums: number[]): number[][] {
  const seen = new Set<string>();
  const result: number[][] = [];
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    const complements = new Set<number>();
    for (let j = i + 1; j < n; j++) {
      const need = -nums[i] - nums[j];
      if (complements.has(need)) {
        const triplet = [nums[i], nums[j], need].sort((a, b) => a - b);
        const key = triplet.join(",");
        if (!seen.has(key)) {
          seen.add(key);
          result.push(triplet);
        }
      }
      complements.add(nums[j]);
    }
  }
  return result;
}

/**
 * Sort once, fix i, then move two pointers inward, skipping duplicates so
 * no dedupe set is needed. O(n^2) time, O(1) extra space (besides sorting/output).
 */
export function threeSumOptimal(nums: number[]): number[][] {
  nums.sort((a, b) => a - b);
  const result: number[][] = [];
  const n = nums.length;
  for (let i = 0; i < n - 2; i++) {
    if (nums[i] > 0) break;
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let lo = i + 1;
    let hi = n - 1;
    while (lo < hi) {
      const sum = nums[i] + nums[lo] + nums[hi];
      if (sum < 0) lo++;
      else if (sum > 0) hi--;
      else {
        result.push([nums[i], nums[lo], nums[hi]]);
        lo++;
        hi--;
        while (lo < hi && nums[lo] === nums[lo - 1]) lo++;
        while (lo < hi && nums[hi] === nums[hi + 1]) hi--;
      }
    }
  }
  return result;
}

function normalize(triplets: number[][]): string[] {
  return triplets.map((t) => [...t].sort((a, b) => a - b).join(",")).sort();
}

if (import.meta.main) {
  const tests: [number[], number[][]][] = [
    [[-1, 0, 1, 2, -1, -4], [[-1, -1, 2], [-1, 0, 1]]],
    [[0, 1, 1], []],
    [[0, 0, 0], [[0, 0, 0]]],
  ];
  for (const [nums, expected] of tests) {
    for (const fn of [threeSumBruteForce, threeSumBetter, threeSumOptimal]) {
      assert.deepEqual(normalize(fn([...nums])), normalize(expected), `${fn.name}(${JSON.stringify(nums)})`);
    }
  }
  console.log("All 3Sum tests passed.");
}
