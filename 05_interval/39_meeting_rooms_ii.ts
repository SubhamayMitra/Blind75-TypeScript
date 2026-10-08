/**
 * 39. Meeting Rooms II
 * LeetCode #253 (Premium) | Difficulty: Medium | Category: Interval
 *
 * Problem
 * -------
 * Given an array of meeting time intervals `intervals`, return the minimum
 * number of conference rooms required to hold all the meetings.
 *
 * Example
 * -------
 * Input: intervals = [[0,30],[5,10],[15,20]]
 * Output: 2
 *
 * Constraints
 * -----------
 * 0 <= intervals.length <= 10^4
 *
 * Approaches
 * ----------
 * 1. Brute force (`minMeetingRoomsBruteForce`) - The peak overlap always
 *    occurs at some meeting's start time, so for each start count the meetings
 *    active at that instant. O(n^2) time, O(1) space.
 * 2. Better (`minMeetingRoomsBetter`) - Sort by start; keep a min-heap of end
 *    times for rooms in use. If the earliest-ending meeting is over before the
 *    next starts, reuse that room. The heap size is the number of rooms. O(n
 *    log n) time, O(n) space.
 * 3. Optimal (`minMeetingRoomsOptimal`) - Sort starts and ends separately and
 *    sweep: each start either needs a new room or reuses one freed by the
 *    earliest unprocessed end. O(n log n) time, O(n) space.
 */
import assert from "node:assert/strict";
import { Heap } from "../common/heap.ts";

/**
 * The peak overlap always occurs at some meeting's start time, so for each
 * start count the meetings active at that instant. O(n^2) time, O(1) space.
 */
export function minMeetingRoomsBruteForce(intervals: number[][]): number {
  let best = 0;
  for (const [t] of intervals) {
    let active = 0;
    for (const [start, end] of intervals) if (start <= t && t < end) active++;
    best = Math.max(best, active);
  }
  return best;
}

/**
 * Sort by start; keep a min-heap of end times for rooms in use. If the
 * earliest-ending meeting is over before the next starts, reuse that room.
 * The heap size is the number of rooms. O(n log n) time, O(n) space.
 */
export function minMeetingRoomsBetter(intervals: number[][]): number {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const ends = new Heap<number>((a, b) => a - b);
  for (const [start, end] of sorted) {
    if (ends.size > 0 && ends.peek()! <= start) ends.replace(end);
    else ends.push(end);
  }
  return ends.size;
}

/**
 * Sort starts and ends separately and sweep: each start either needs a new
 * room or reuses one freed by the earliest unprocessed end.
 * O(n log n) time, O(n) space.
 */
export function minMeetingRoomsOptimal(intervals: number[][]): number {
  const starts = intervals.map((iv) => iv[0]).sort((a, b) => a - b);
  const ends = intervals.map((iv) => iv[1]).sort((a, b) => a - b);
  let rooms = 0;
  let endPtr = 0;
  for (const start of starts) {
    if (start < ends[endPtr]) rooms++;
    else endPtr++;
  }
  return rooms;
}

if (import.meta.main) {
  const tests: [number[][], number][] = [
    [[[0, 30], [5, 10], [15, 20]], 2],
    [[[7, 10], [2, 4]], 1],
    [[], 0],
    [[[1, 5], [8, 9], [8, 9]], 2],
    [[[1, 10], [2, 7], [3, 19], [8, 12], [10, 20], [11, 30]], 4],
  ];
  for (const [intervals, expected] of tests) {
    for (const fn of [minMeetingRoomsBruteForce, minMeetingRoomsBetter, minMeetingRoomsOptimal]) {
      assert.equal(fn(intervals.map((iv) => [...iv])), expected, `${fn.name}(${JSON.stringify(intervals)})`);
    }
  }
  console.log("All Meeting Rooms II tests passed.");
}
