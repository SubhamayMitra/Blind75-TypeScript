/**
 * 44. Remove Nth Node From End Of List
 * LeetCode #19 | Difficulty: Medium | Category: Linked List
 *
 * Problem
 * -------
 * Given the head of a linked list, remove the n-th node from the end of
 * the list and return its head.
 *
 * Example
 * -------
 * Input: head = [1,2,3,4,5], n = 2
 * Output: [1,2,3,5]
 *
 * Constraints
 * -----------
 * 1 <= number of nodes <= 30, 1 <= n <= number of nodes
 *
 * Approaches
 * ----------
 * 1. Brute force (`removeNthFromEndBruteForce`) - Count the length in one
 *    pass, then walk to the node before the target and unlink it. O(n) time
 *    (two passes), O(1) space.
 * 2. Better (`removeNthFromEndBetter`) - Collect node references in an array
 *    and index straight to the predecessor. O(n) time, O(n) space.
 * 3. Optimal (`removeNthFromEndOptimal`) - One pass with two pointers: move
 *    `fast` n steps ahead, then advance both until `fast` reaches the last
 *    node; `slow` is then just before the target. A dummy head handles
 *    removing the first node. O(n) time, O(1) space.
 */
import assert from "node:assert/strict";
import { buildList, ListNode, listToArray } from "../common/linked-list.ts";

/** Count the length in one pass, then walk to the node before the target and unlink it. O(n) time (two passes), O(1) space. */
export function removeNthFromEndBruteForce(head: ListNode | null, n: number): ListNode | null {
  let length = 0;
  for (let node = head; node; node = node.next) length++;
  const dummy = new ListNode(0, head);
  let prev = dummy;
  for (let i = 0; i < length - n; i++) prev = prev.next!;
  prev.next = prev.next!.next;
  return dummy.next;
}

/** Collect node references in an array and index straight to the predecessor. O(n) time, O(n) space. */
export function removeNthFromEndBetter(head: ListNode | null, n: number): ListNode | null {
  const nodes: ListNode[] = [];
  for (let node = head; node; node = node.next) nodes.push(node);
  const target = nodes.length - n;
  if (target === 0) return head!.next;
  nodes[target - 1].next = nodes[target].next;
  return head;
}

/**
 * One pass with two pointers: move `fast` n steps ahead, then advance both
 * until `fast` reaches the last node; `slow` is then just before the
 * target. A dummy head handles removing the first node. O(n) time, O(1) space.
 */
export function removeNthFromEndOptimal(head: ListNode | null, n: number): ListNode | null {
  const dummy = new ListNode(0, head);
  let fast: ListNode = dummy;
  let slow: ListNode = dummy;
  for (let i = 0; i < n; i++) fast = fast.next!;
  while (fast.next) {
    fast = fast.next;
    slow = slow.next!;
  }
  slow.next = slow.next!.next;
  return dummy.next;
}

if (import.meta.main) {
  const tests: [number[], number, number[]][] = [
    [[1, 2, 3, 4, 5], 2, [1, 2, 3, 5]],
    [[1], 1, []],
    [[1, 2], 1, [1]],
    [[1, 2], 2, [2]],
  ];
  for (const [values, n, expected] of tests) {
    for (const fn of [removeNthFromEndBruteForce, removeNthFromEndBetter, removeNthFromEndOptimal]) {
      assert.deepEqual(listToArray(fn(buildList(values), n)), expected, `${fn.name}(${JSON.stringify(values)}, ${n})`);
    }
  }
  console.log("All Remove Nth Node From End of List tests passed.");
}
