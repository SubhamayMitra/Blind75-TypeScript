/**
 * 38. Meeting Rooms
 * LeetCode #252 (Premium) | Difficulty: Easy | Category: Interval
 *
 * Problem
 * -------
 * Given an array of meeting time intervals `intervals` where
 * intervals[i] = [start_i, end_i], determine if a person could attend all
 * meetings (i.e., no two meetings overlap).
 *
 * Example
 * -------
 * Input: intervals = [[0,30],[5,10],[15,20]]
 * Output: false       // [0,30] overlaps both other meetings
 *
 * Constraints
 * -----------
 * 0 <= intervals.length <= 10^4
 *
 * Approaches
 * ----------
 * 1. Brute force (`canAttendMeetingsBruteForce`) - Compare every pair of
 *    meetings for overlap. O(n^2) time, O(1) space.
 * 2. Better (`canAttendMeetingsBetter`) - Sort by start and sweep, tracking
 *    the latest end time seen so far; a meeting that starts before that end
 *    overlaps some earlier meeting. O(n log n) time, O(1) extra space.
 * 3. Optimal (`canAttendMeetingsOptimal`) - Sort by start; once sorted,
 *    overlap can only occur between adjacent meetings, so a single comparison
 *    per neighbour suffices. O(n log n) time, O(1) extra space.
 */
import assert from "node:assert/strict";

/** Compare every pair of meetings for overlap. O(n^2) time, O(1) space. */
export function canAttendMeetingsBruteForce(intervals: number[][]): boolean {
  for (let i = 0; i < intervals.length; i++) {
    for (let j = i + 1; j < intervals.length; j++) {
      const [a, b] = [intervals[i], intervals[j]];
      if (a[0] < b[1] && b[0] < a[1]) return false;
    }
  }
  return true;
}

/**
 * Sort by start and sweep, tracking the latest end time seen so far; a
 * meeting that starts before that end overlaps some earlier meeting.
 * O(n log n) time, O(1) extra space.
 */
export function canAttendMeetingsBetter(intervals: number[][]): boolean {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  let latestEnd = -Infinity;
  for (const [start, end] of sorted) {
    if (start < latestEnd) return false;
    latestEnd = Math.max(latestEnd, end);
  }
  return true;
}

/**
 * Sort by start; once sorted, overlap can only occur between adjacent
 * meetings, so a single comparison per neighbour suffices.
 * O(n log n) time, O(1) extra space.
 */
export function canAttendMeetingsOptimal(intervals: number[][]): boolean {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i][0] < sorted[i - 1][1]) return false;
  }
  return true;
}

if (import.meta.main) {
  const tests: [number[][], boolean][] = [
    [[[0, 30], [5, 10], [15, 20]], false],
    [[[7, 10], [2, 4]], true],
    [[], true],
    [[[1, 5]], true],
    [[[1, 5], [5, 10]], true],
  ];
  for (const [intervals, expected] of tests) {
    for (const fn of [canAttendMeetingsBruteForce, canAttendMeetingsBetter, canAttendMeetingsOptimal]) {
      assert.equal(fn(intervals.map((iv) => [...iv])), expected, `${fn.name}(${JSON.stringify(intervals)})`);
    }
  }
  console.log("All Meeting Rooms tests passed.");
}
