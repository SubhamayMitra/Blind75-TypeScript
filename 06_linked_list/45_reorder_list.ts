/**
 * 45. Reorder List
 * LeetCode #143 | Difficulty: Medium | Category: Linked List
 *
 * Problem
 * -------
 * Given the head of a singly linked list L0 -> L1 -> ... -> Ln-1 -> Ln,
 * reorder it in place to:
 * L0 -> Ln -> L1 -> Ln-1 -> L2 -> Ln-2 -> ...
 * You may not modify the values in the list's nodes, only the links.
 *
 * Example
 * -------
 * Input: 1 -> 2 -> 3 -> 4
 * Output: 1 -> 4 -> 2 -> 3
 *
 * Constraints
 * -----------
 * 1 <= number of nodes <= 5 * 10^4
 *
 * Approaches
 * ----------
 * 1. Brute force (`reorderListBruteForce`) - Copy node references into an
 *    array, then relink them by alternately taking from the front and the
 *    back. O(n) time, O(n) space.
 * 2. Better (`reorderListBetter`) - Same idea expressed as a deque: repeatedly
 *    take one node from the front and one from the back, appending each to the
 *    tail as we go. O(n) time, O(n) space.
 * 3. Optimal (`reorderListOptimal`) - In place: find the middle with slow/fast
 *    pointers, reverse the second half, then interleave the two halves. O(n)
 *    time, O(1) space.
 */
import assert from "node:assert/strict";
import { buildList, ListNode, listToArray } from "../common/linked-list.ts";

/**
 * Copy node references into an array, then relink them by alternately
 * taking from the front and the back. O(n) time, O(n) space.
 */
export function reorderListBruteForce(head: ListNode | null): void {
  const nodes: ListNode[] = [];
  for (let node = head; node; node = node.next) nodes.push(node);
  const order: ListNode[] = [];
  for (let i = 0, j = nodes.length - 1; i <= j; i++, j--) {
    order.push(nodes[i]);
    if (i !== j) order.push(nodes[j]);
  }
  for (let k = 0; k < order.length; k++) order[k].next = order[k + 1] ?? null;
}

/**
 * Same idea expressed as a deque: repeatedly take one node from the front
 * and one from the back, appending each to the tail as we go.
 * O(n) time, O(n) space.
 */
export function reorderListBetter(head: ListNode | null): void {
  if (!head) return;
  const deque: ListNode[] = [];
  for (let node = head.next; node; node = node.next) deque.push(node);
  let front = 0;
  let back = deque.length - 1;
  let tail = head;
  let fromBack = true;
  while (front <= back) {
    tail.next = fromBack ? deque[back--] : deque[front++];
    tail = tail.next;
    fromBack = !fromBack;
  }
  tail.next = null;
}

/**
 * In place: find the middle with slow/fast pointers, reverse the second
 * half, then interleave the two halves. O(n) time, O(1) space.
 */
export function reorderListOptimal(head: ListNode | null): void {
  if (!head || !head.next) return;

  let slow = head;
  let fast: ListNode | null = head;
  while (fast?.next?.next) {
    slow = slow.next!;
    fast = fast.next.next;
  }

  let second: ListNode | null = slow.next;
  slow.next = null;
  let prev: ListNode | null = null;
  while (second) {
    const next: ListNode | null = second.next;
    second.next = prev;
    prev = second;
    second = next;
  }

  let first: ListNode | null = head;
  second = prev;
  while (second) {
    const firstNext: ListNode | null = first!.next;
    const secondNext: ListNode | null = second.next;
    first!.next = second;
    second.next = firstNext;
    first = firstNext;
    second = secondNext;
  }
}

if (import.meta.main) {
  const tests: [number[], number[]][] = [
    [[1, 2, 3, 4], [1, 4, 2, 3]],
    [[1, 2, 3, 4, 5], [1, 5, 2, 4, 3]],
    [[1], [1]],
    [[1, 2], [1, 2]],
    [[], []],
  ];
  for (const [values, expected] of tests) {
    for (const fn of [reorderListBruteForce, reorderListBetter, reorderListOptimal]) {
      const head = buildList(values);
      fn(head);
      assert.deepEqual(listToArray(head), expected, `${fn.name}(${JSON.stringify(values)})`);
    }
  }
  console.log("All Reorder List tests passed.");
}
