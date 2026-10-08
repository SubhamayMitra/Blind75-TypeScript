/**
 * 43. Merge k Sorted Lists
 * LeetCode #23 | Difficulty: Hard | Category: Linked List / Heap
 *
 * Problem
 * -------
 * Given an array of `k` linked lists, each sorted in ascending order,
 * merge all the lists into one sorted linked list and return its head.
 *
 * Example
 * -------
 * Input: lists = [[1,4,5],[1,3,4],[2,6]]
 * Output: [1,1,2,3,4,4,5,6]
 *
 * Constraints
 * -----------
 * 0 <= k <= 10^4, total nodes across all lists <= 10^4
 *
 * Approaches
 * ----------
 * 1. Brute force (`mergeKListsBruteForce`) - Collect every value, sort,
 *    rebuild. O(N log N) time, O(N) space (N = total nodes).
 * 2. Better (`mergeKListsBetter`) - Divide and conquer: merge lists in pairs,
 *    halving the count each round. O(log k) rounds of O(N) work. O(N log k)
 *    time, O(1) extra space besides the per-round array of heads.
 * 3. Optimal (`mergeKListsOptimal`) - Min-heap of the current head of each
 *    list: pop the smallest, append it, push its successor. Each of the N
 *    nodes is pushed/popped once at O(log k) cost. O(N log k) time, O(k)
 *    space.
 */
import assert from "node:assert/strict";
import { Heap } from "../common/heap.ts";
import { buildList, ListNode, listToArray } from "../common/linked-list.ts";

/** Collect every value, sort, rebuild. O(N log N) time, O(N) space (N = total nodes). */
export function mergeKListsBruteForce(lists: (ListNode | null)[]): ListNode | null {
  const values: number[] = [];
  for (const head of lists) values.push(...listToArray(head));
  return buildList(values.sort((a, b) => a - b));
}

function mergeTwo(a: ListNode | null, b: ListNode | null): ListNode | null {
  const dummy = new ListNode();
  let tail = dummy;
  while (a && b) {
    if (a.val <= b.val) {
      tail.next = a;
      a = a.next;
    } else {
      tail.next = b;
      b = b.next;
    }
    tail = tail.next;
  }
  tail.next = a ?? b;
  return dummy.next;
}

/**
 * Divide and conquer: merge lists in pairs, halving the count each round.
 * O(log k) rounds of O(N) work. O(N log k) time, O(1) extra space besides
 * the per-round array of heads.
 */
export function mergeKListsBetter(lists: (ListNode | null)[]): ListNode | null {
  if (lists.length === 0) return null;
  let round = [...lists];
  while (round.length > 1) {
    const next: (ListNode | null)[] = [];
    for (let i = 0; i < round.length; i += 2) next.push(mergeTwo(round[i], round[i + 1] ?? null));
    round = next;
  }
  return round[0];
}

/**
 * Min-heap of the current head of each list: pop the smallest, append it,
 * push its successor. Each of the N nodes is pushed/popped once at
 * O(log k) cost. O(N log k) time, O(k) space.
 */
export function mergeKListsOptimal(lists: (ListNode | null)[]): ListNode | null {
  const heap = new Heap<ListNode>(
    (a, b) => a.val - b.val,
    lists.filter((node): node is ListNode => node !== null),
  );
  const dummy = new ListNode();
  let tail = dummy;
  while (heap.size > 0) {
    const node = heap.pop()!;
    tail.next = node;
    tail = node;
    if (node.next) heap.push(node.next);
  }
  return dummy.next;
}

if (import.meta.main) {
  const tests: [number[][], number[]][] = [
    [[[1, 4, 5], [1, 3, 4], [2, 6]], [1, 1, 2, 3, 4, 4, 5, 6]],
    [[], []],
    [[[]], []],
    [[[2], [], [-1]], [-1, 2]],
  ];
  for (const [listValues, expected] of tests) {
    for (const fn of [mergeKListsBruteForce, mergeKListsBetter, mergeKListsOptimal]) {
      const result = fn(listValues.map((values) => buildList(values)));
      assert.deepEqual(listToArray(result), expected, `${fn.name}(${JSON.stringify(listValues)})`);
    }
  }
  console.log("All Merge k Sorted Lists tests passed.");
}
