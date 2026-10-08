/**
 * 41. Linked List Cycle (Detect Cycle in a Linked List)
 * LeetCode #141 | Difficulty: Easy | Category: Linked List
 *
 * Problem
 * -------
 * Given the head of a linked list, determine if the linked list has a
 * cycle in it (some node's `next` pointer eventually points back to a
 * node already visited).
 *
 * Example
 * -------
 * Input: 3 -> 2 -> 0 -> -4 -> (back to node with value 2)
 * Output: true
 *
 * Constraints
 * -----------
 * 0 <= number of nodes <= 10^4
 *
 * Approaches
 * ----------
 * 1. Brute force (`hasCycleBruteForce`) - No extra memory: for the node at
 *    position k, re-walk the first k nodes from the head and check whether
 *    this node already appeared. A cycle is found the first time `next` points
 *    back to an earlier node. O(n^2) time, O(1) space.
 * 2. Better (`hasCycleBetter`) - Record visited node identities in a Set;
 *    seeing one twice means a cycle. O(n) time, O(n) space.
 * 3. Optimal (`hasCycleOptimal`) - Floyd's tortoise and hare: a fast pointer
 *    laps a slow one iff there is a cycle. O(n) time, O(1) space.
 */
import assert from "node:assert/strict";
import { ListNode } from "../common/linked-list.ts";

/**
 * No extra memory: for the node at position k, re-walk the first k nodes
 * from the head and check whether this node already appeared. A cycle is
 * found the first time `next` points back to an earlier node.
 * O(n^2) time, O(1) space.
 */
export function hasCycleBruteForce(head: ListNode | null): boolean {
  let position = 0;
  for (let node = head; node; node = node.next, position++) {
    let probe = head;
    for (let i = 0; i < position; i++, probe = probe!.next) {
      if (probe === node.next) return true;
    }
    if (node.next === node) return true;
  }
  return false;
}

/** Record visited node identities in a Set; seeing one twice means a cycle. O(n) time, O(n) space. */
export function hasCycleBetter(head: ListNode | null): boolean {
  const seen = new Set<ListNode>();
  for (let node = head; node; node = node.next) {
    if (seen.has(node)) return true;
    seen.add(node);
  }
  return false;
}

/** Floyd's tortoise and hare: a fast pointer laps a slow one iff there is a cycle. O(n) time, O(1) space. */
export function hasCycleOptimal(head: ListNode | null): boolean {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}

/** Build a list whose tail links back to index `pos` (-1 for no cycle). */
function buildWithCycle(values: number[], pos: number): ListNode | null {
  const nodes = values.map((v) => new ListNode(v));
  nodes.forEach((node, i) => (node.next = nodes[i + 1] ?? null));
  if (pos >= 0 && nodes.length > 0) nodes[nodes.length - 1].next = nodes[pos];
  return nodes[0] ?? null;
}

if (import.meta.main) {
  const tests: [number[], number, boolean][] = [
    [[3, 2, 0, -4], 1, true],
    [[1, 2], 0, true],
    [[1], 0, true],
    [[1], -1, false],
    [[], -1, false],
    [[1, 2, 3, 4], -1, false],
  ];
  for (const [values, pos, expected] of tests) {
    for (const fn of [hasCycleBruteForce, hasCycleBetter, hasCycleOptimal]) {
      assert.equal(fn(buildWithCycle(values, pos)), expected, `${fn.name}(${JSON.stringify(values)}, pos=${pos})`);
    }
  }
  console.log("All Linked List Cycle tests passed.");
}
