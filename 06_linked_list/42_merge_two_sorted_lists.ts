/**
 * 42. Merge Two Sorted Lists
 * LeetCode #21 | Difficulty: Easy | Category: Linked List
 *
 * Problem
 * -------
 * Merge two sorted linked lists `list1` and `list2` into one sorted list
 * by splicing together their nodes, and return the head of the merged
 * list.
 *
 * Example
 * -------
 * Input: list1 = 1 -> 2 -> 4, list2 = 1 -> 3 -> 4
 * Output: 1 -> 1 -> 2 -> 3 -> 4 -> 4
 *
 * Constraints
 * -----------
 * 0 <= number of nodes in each list <= 50
 *
 * Approaches
 * ----------
 * 1. Brute force (`mergeTwoListsBruteForce`) - Dump both lists' values into an
 *    array, sort, and build a new list. O((m+n) log(m+n)) time, O(m+n) space.
 * 2. Better (`mergeTwoListsRecursive`) - Pick the smaller head and attach the
 *    merge of the rest. O(m+n) time, O(m+n) stack space.
 * 3. Optimal (`mergeTwoListsOptimal`) - Splice existing nodes together behind
 *    a dummy head with a running tail. O(m+n) time, O(1) extra space.
 */
import assert from "node:assert/strict";
import { buildList, ListNode, listToArray } from "../common/linked-list.ts";

/** Dump both lists' values into an array, sort, and build a new list. O((m+n) log(m+n)) time, O(m+n) space. */
export function mergeTwoListsBruteForce(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  return buildList([...listToArray(l1), ...listToArray(l2)].sort((a, b) => a - b));
}

/** Pick the smaller head and attach the merge of the rest. O(m+n) time, O(m+n) stack space. */
export function mergeTwoListsRecursive(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  if (!l1) return l2;
  if (!l2) return l1;
  if (l1.val <= l2.val) {
    l1.next = mergeTwoListsRecursive(l1.next, l2);
    return l1;
  }
  l2.next = mergeTwoListsRecursive(l1, l2.next);
  return l2;
}

/** Splice existing nodes together behind a dummy head with a running tail. O(m+n) time, O(1) extra space. */
export function mergeTwoListsOptimal(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const dummy = new ListNode();
  let tail = dummy;
  while (l1 && l2) {
    if (l1.val <= l2.val) {
      tail.next = l1;
      l1 = l1.next;
    } else {
      tail.next = l2;
      l2 = l2.next;
    }
    tail = tail.next;
  }
  tail.next = l1 ?? l2;
  return dummy.next;
}

if (import.meta.main) {
  const tests: [number[], number[], number[]][] = [
    [[1, 2, 4], [1, 3, 4], [1, 1, 2, 3, 4, 4]],
    [[], [], []],
    [[], [0], [0]],
    [[5], [1, 2, 3], [1, 2, 3, 5]],
  ];
  for (const [a, b, expected] of tests) {
    for (const fn of [mergeTwoListsBruteForce, mergeTwoListsRecursive, mergeTwoListsOptimal]) {
      assert.deepEqual(listToArray(fn(buildList(a), buildList(b))), expected, `${fn.name}(${JSON.stringify(a)}, ${JSON.stringify(b)})`);
    }
  }
  console.log("All Merge Two Sorted Lists tests passed.");
}
