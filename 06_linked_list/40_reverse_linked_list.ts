/**
 * 40. Reverse a Linked List
 * LeetCode #206 | Difficulty: Easy | Category: Linked List
 *
 * Problem
 * -------
 * Given the head of a singly linked list, reverse the list and return the
 * new head.
 *
 * Example
 * -------
 * Input: 1 -> 2 -> 3 -> 4 -> 5 -> null
 * Output: 5 -> 4 -> 3 -> 2 -> 1 -> null
 *
 * Constraints
 * -----------
 * 0 <= number of nodes <= 5000
 *
 * Approaches
 * ----------
 * 1. Brute force (`reverseListBruteForce`) - Copy values into an array and
 *    build a brand-new list in reverse. O(n) time, O(n) space.
 * 2. Better (`reverseListRecursive`) - Recursively reverse the rest, then hook
 *    the current node onto its tail. O(n) time, O(n) stack space.
 * 3. Optimal (`reverseListOptimal`) - Walk once, flipping each `next` pointer
 *    with prev/curr/next pointers. O(n) time, O(1) space.
 */
import assert from "node:assert/strict";
import { buildList, ListNode, listToArray } from "../common/linked-list.ts";

/** Copy values into an array and build a brand-new list in reverse. O(n) time, O(n) space. */
export function reverseListBruteForce(head: ListNode | null): ListNode | null {
  const values: number[] = [];
  for (let node = head; node; node = node.next) values.push(node.val);
  let reversed: ListNode | null = null;
  for (const v of values) reversed = new ListNode(v, reversed);
  return reversed;
}

/** Recursively reverse the rest, then hook the current node onto its tail. O(n) time, O(n) stack space. */
export function reverseListRecursive(head: ListNode | null): ListNode | null {
  if (!head || !head.next) return head;
  const newHead = reverseListRecursive(head.next);
  head.next.next = head;
  head.next = null;
  return newHead;
}

/** Walk once, flipping each `next` pointer with prev/curr/next pointers. O(n) time, O(1) space. */
export function reverseListOptimal(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let curr = head;
  while (curr) {
    const next: ListNode | null = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}

if (import.meta.main) {
  const tests: [number[], number[]][] = [
    [[1, 2, 3, 4, 5], [5, 4, 3, 2, 1]],
    [[1, 2], [2, 1]],
    [[], []],
    [[1], [1]],
  ];
  for (const [values, expected] of tests) {
    for (const fn of [reverseListBruteForce, reverseListRecursive, reverseListOptimal]) {
      assert.deepEqual(listToArray(fn(buildList(values))), expected, `${fn.name}(${JSON.stringify(values)})`);
    }
  }
  console.log("All Reverse Linked List tests passed.");
}
