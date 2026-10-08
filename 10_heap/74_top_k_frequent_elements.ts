/**
 * 74. Top K Frequent Elements
 * LeetCode #347 | Difficulty: Medium | Category: Heap
 *
 * Problem
 * -------
 * Given an integer array `nums` and an integer `k`, return the `k` most
 * frequent elements. You may return the answer in any order.
 *
 * Example
 * -------
 * Input: nums = [1,1,1,2,2,3], k = 2
 * Output: [1,2]
 *
 * Constraints
 * -----------
 * 1 <= nums.length <= 10^5, k is always valid (1 <= k <= number of distinct
 * elements).
 *
 * Approaches
 * ----------
 * 1. Brute force (`topKFrequentBruteForce`) - Count, then sort every distinct
 *    value by frequency descending and take k. O(n log n) time, O(n) space.
 * 2. Better (`topKFrequentBetter`) - Count, then keep a min-heap (by
 *    frequency) of size k: push every entry and evict the least frequent
 *    whenever the heap grows past k. O(n log k) time, O(n) space.
 * 3. Optimal (`topKFrequentOptimal`) - Bucket sort by frequency: buckets[f]
 *    holds values seen exactly f times (f ranges 1..n), then read buckets from
 *    the highest frequency down. O(n) time, O(n) space.
 */
import assert from "node:assert/strict";
import { Heap } from "../common/heap.ts";

function countFrequencies(nums: number[]): Map<number, number> {
  const counts = new Map<number, number>();
  for (const num of nums) counts.set(num, (counts.get(num) ?? 0) + 1);
  return counts;
}

/** Count, then sort every distinct value by frequency descending and take k. O(n log n) time, O(n) space. */
export function topKFrequentBruteForce(nums: number[], k: number): number[] {
  return [...countFrequencies(nums).entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(([num]) => num);
}

/**
 * Count, then keep a min-heap (by frequency) of size k: push every entry
 * and evict the least frequent whenever the heap grows past k.
 * O(n log k) time, O(n) space.
 */
export function topKFrequentBetter(nums: number[], k: number): number[] {
  const heap = new Heap<[number, number]>((a, b) => a[1] - b[1]);
  for (const entry of countFrequencies(nums)) {
    heap.push(entry);
    if (heap.size > k) heap.pop();
  }
  const result: number[] = [];
  while (heap.size > 0) result.push(heap.pop()![0]);
  return result.reverse();
}

/**
 * Bucket sort by frequency: buckets[f] holds values seen exactly f times
 * (f ranges 1..n), then read buckets from the highest frequency down.
 * O(n) time, O(n) space.
 */
export function topKFrequentOptimal(nums: number[], k: number): number[] {
  const buckets: number[][] = Array.from({ length: nums.length + 1 }, () => []);
  for (const [num, freq] of countFrequencies(nums)) buckets[freq].push(num);
  const result: number[] = [];
  for (let freq = nums.length; freq > 0 && result.length < k; freq--) {
    for (const num of buckets[freq]) {
      result.push(num);
      if (result.length === k) break;
    }
  }
  return result;
}

if (import.meta.main) {
  const tests: [number[], number, number[]][] = [
    [[1, 1, 1, 2, 2, 3], 2, [1, 2]],
    [[1], 1, [1]],
    [[4, 1, 1, 2, 2, 2, 3], 2, [1, 2]],
    [[-1, -1, 5], 1, [-1]],
  ];
  for (const [nums, k, expected] of tests) {
    for (const fn of [topKFrequentBruteForce, topKFrequentBetter, topKFrequentOptimal]) {
      const result = fn([...nums], k);
      assert.deepEqual(result.sort((a, b) => a - b), expected, `${fn.name}(${JSON.stringify(nums)}, ${k})`);
    }
  }
  console.log("All Top K Frequent Elements tests passed.");
}
