/**
 * 75. Find Median from Data Stream
 * LeetCode #295 | Difficulty: Hard | Category: Heap
 *
 * Problem
 * -------
 * Design a data structure that supports adding integers from a data
 * stream one at a time (`addNum`) and finding the median of all elements
 * added so far (`findMedian`) at any point.
 *
 * Example
 * -------
 * Input: addNum(1); addNum(2); findMedian() -> 1.5; addNum(3);
 *        findMedian() -> 2
 *
 * Constraints
 * -----------
 * Up to 5*10^4 calls to addNum and findMedian combined.
 *
 * Approaches
 * ----------
 * 1. Brute force (`MedianFinderBruteForce`) - Append to an unsorted array;
 *    sort a copy on every findMedian. addNum O(1), findMedian O(n log n).
 * 2. Better (`MedianFinderBetter`) - Keep the array sorted: binary-search the
 *    insertion point and splice. addNum O(n) (shifting elements), findMedian
 *    O(1).
 * 3. Optimal (`MedianFinderOptimal`) - Two heaps: a max-heap `low` for the
 *    smaller half and a min-heap `high` for the larger half, with low.size ===
 *    high.size or high.size + 1. The median is low's top, or the mean of both
 *    tops. addNum O(log n), findMedian O(1).
 */
import assert from "node:assert/strict";
import { Heap } from "../common/heap.ts";

interface MedianStream {
  addNum(num: number): void;
  findMedian(): number;
}

function medianOfSorted(sorted: number[]): number {
  const n = sorted.length;
  const mid = n >> 1;
  return n % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/** Append to an unsorted array; sort a copy on every findMedian. addNum O(1), findMedian O(n log n). */
export class MedianFinderBruteForce implements MedianStream {
  private readonly nums: number[] = [];

  addNum(num: number): void {
    this.nums.push(num);
  }

  findMedian(): number {
    return medianOfSorted([...this.nums].sort((a, b) => a - b));
  }
}

/**
 * Keep the array sorted: binary-search the insertion point and splice.
 * addNum O(n) (shifting elements), findMedian O(1).
 */
export class MedianFinderBetter implements MedianStream {
  private readonly nums: number[] = [];

  addNum(num: number): void {
    let lo = 0;
    let hi = this.nums.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (this.nums[mid] < num) lo = mid + 1;
      else hi = mid;
    }
    this.nums.splice(lo, 0, num);
  }

  findMedian(): number {
    return medianOfSorted(this.nums);
  }
}

/**
 * Two heaps: a max-heap `low` for the smaller half and a min-heap `high`
 * for the larger half, with low.size === high.size or high.size + 1.
 * The median is low's top, or the mean of both tops.
 * addNum O(log n), findMedian O(1).
 */
export class MedianFinderOptimal implements MedianStream {
  private readonly low = new Heap<number>((a, b) => b - a);
  private readonly high = new Heap<number>((a, b) => a - b);

  addNum(num: number): void {
    // route through `low` so every element in low <= every element in high
    this.low.push(num);
    this.high.push(this.low.pop()!);
    if (this.high.size > this.low.size) this.low.push(this.high.pop()!);
  }

  findMedian(): number {
    if (this.low.size > this.high.size) return this.low.peek()!;
    return (this.low.peek()! + this.high.peek()!) / 2;
  }
}

if (import.meta.main) {
  for (const FinderClass of [MedianFinderBruteForce, MedianFinderBetter, MedianFinderOptimal]) {
    const name = FinderClass.name;
    const mf = new FinderClass();
    mf.addNum(1);
    mf.addNum(2);
    assert.equal(mf.findMedian(), 1.5, name);
    mf.addNum(3);
    assert.equal(mf.findMedian(), 2, name);
    mf.addNum(4);
    assert.equal(mf.findMedian(), 2.5, name);

    // randomised cross-check against a sort-based reference
    const stream = new FinderClass();
    const seen: number[] = [];
    for (let i = 0; i < 200; i++) {
      const value = Math.floor(Math.random() * 201) - 100;
      stream.addNum(value);
      seen.push(value);
      assert.equal(stream.findMedian(), medianOfSorted([...seen].sort((a, b) => a - b)), `${name} step ${i}`);
    }
  }
  console.log("All Find Median from Data Stream tests passed.");
}
