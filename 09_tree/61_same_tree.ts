/**
 * 61. Same Tree
 * LeetCode #100 | Difficulty: Easy | Category: Tree
 *
 * Problem
 * -------
 * Given the roots of two binary trees `p` and `q`, return true if they
 * are structurally identical and the nodes have the same values.
 *
 * Example
 * -------
 * Input: p = [1,2,3], q = [1,2,3]
 * Output: true
 *
 * Constraints
 * -----------
 * 0 <= number of nodes in each tree <= 100
 *
 * Approaches
 * ----------
 * 1. Brute force (`isSameTreeBruteForce`) - Serialize both trees with null
 *    markers (so structure is captured) and compare strings. O(n) time, O(n)
 *    space.
 * 2. Better (`isSameTreeBetter`) - BFS over both trees in lockstep with a
 *    queue of node pairs. O(n) time, O(n) space.
 * 3. Optimal (`isSameTreeOptimal`) - Recursive DFS comparing values and both
 *    subtrees. O(n) time, O(h) stack space.
 */
import assert from "node:assert/strict";
import { buildTree, TreeNode } from "../common/tree.ts";

function serialize(node: TreeNode | null): string {
  return node ? `(${node.val},${serialize(node.left)},${serialize(node.right)})` : "#";
}

/** Serialize both trees with null markers (so structure is captured) and compare strings. O(n) time, O(n) space. */
export function isSameTreeBruteForce(p: TreeNode | null, q: TreeNode | null): boolean {
  return serialize(p) === serialize(q);
}

/** BFS over both trees in lockstep with a queue of node pairs. O(n) time, O(n) space. */
export function isSameTreeBetter(p: TreeNode | null, q: TreeNode | null): boolean {
  const queue: [TreeNode | null, TreeNode | null][] = [[p, q]];
  for (let head = 0; head < queue.length; head++) {
    const [a, b] = queue[head];
    if (!a && !b) continue;
    if (!a || !b || a.val !== b.val) return false;
    queue.push([a.left, b.left], [a.right, b.right]);
  }
  return true;
}

/** Recursive DFS comparing values and both subtrees. O(n) time, O(h) stack space. */
export function isSameTreeOptimal(p: TreeNode | null, q: TreeNode | null): boolean {
  if (!p || !q) return p === q;
  return p.val === q.val && isSameTreeOptimal(p.left, q.left) && isSameTreeOptimal(p.right, q.right);
}

if (import.meta.main) {
  const tests: [(number | null)[], (number | null)[], boolean][] = [
    [[1, 2, 3], [1, 2, 3], true],
    [[1, 2], [1, null, 2], false],
    [[1, 2, 1], [1, 1, 2], false],
    [[], [], true],
  ];
  for (const [a, b, expected] of tests) {
    for (const fn of [isSameTreeBruteForce, isSameTreeBetter, isSameTreeOptimal]) {
      assert.equal(fn(buildTree(a), buildTree(b)), expected, `${fn.name}(${JSON.stringify(a)}, ${JSON.stringify(b)})`);
    }
  }
  console.log("All Same Tree tests passed.");
}
