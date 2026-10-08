/**
 * 60. Maximum Depth of Binary Tree
 * LeetCode #104 | Difficulty: Easy | Category: Tree
 *
 * Problem
 * -------
 * Given the root of a binary tree, return its maximum depth (the number
 * of nodes along the longest path from the root down to the farthest leaf
 * node).
 *
 * Example
 * -------
 * Input: root = [3,9,20,null,null,15,7]
 * Output: 3
 *
 * Constraints
 * -----------
 * 0 <= number of nodes <= 10^4
 *
 * Approaches
 * ----------
 * 1. Brute force (`maxDepthBruteForce`) - BFS level by level, counting the
 *    levels. O(n) time, O(w) space (w = widest level).
 * 2. Better (`maxDepthBetter`) - Iterative DFS with an explicit stack of
 *    (node, depth) pairs. O(n) time, O(n) space.
 * 3. Optimal (`maxDepthOptimal`) - Recursive DFS: depth = 1 + max(depth(left),
 *    depth(right)). O(n) time, O(h) stack space.
 */
import assert from "node:assert/strict";
import { buildTree, TreeNode } from "../common/tree.ts";

/** BFS level by level, counting the levels. O(n) time, O(w) space (w = widest level). */
export function maxDepthBruteForce(root: TreeNode | null): number {
  if (!root) return 0;
  let depth = 0;
  let level: TreeNode[] = [root];
  while (level.length > 0) {
    depth++;
    const next: TreeNode[] = [];
    for (const node of level) {
      if (node.left) next.push(node.left);
      if (node.right) next.push(node.right);
    }
    level = next;
  }
  return depth;
}

/** Iterative DFS with an explicit stack of (node, depth) pairs. O(n) time, O(n) space. */
export function maxDepthBetter(root: TreeNode | null): number {
  let best = 0;
  const stack: [TreeNode | null, number][] = [[root, 1]];
  while (stack.length > 0) {
    const [node, depth] = stack.pop()!;
    if (!node) continue;
    best = Math.max(best, depth);
    stack.push([node.left, depth + 1], [node.right, depth + 1]);
  }
  return best;
}

/** Recursive DFS: depth = 1 + max(depth(left), depth(right)). O(n) time, O(h) stack space. */
export function maxDepthOptimal(root: TreeNode | null): number {
  if (!root) return 0;
  return 1 + Math.max(maxDepthOptimal(root.left), maxDepthOptimal(root.right));
}

if (import.meta.main) {
  const tests: [(number | null)[], number][] = [
    [[3, 9, 20, null, null, 15, 7], 3],
    [[1, null, 2], 2],
    [[], 0],
  ];
  for (const [values, expected] of tests) {
    for (const fn of [maxDepthBruteForce, maxDepthBetter, maxDepthOptimal]) {
      assert.equal(fn(buildTree(values)), expected, `${fn.name}(${JSON.stringify(values)})`);
    }
  }
  console.log("All Maximum Depth of Binary Tree tests passed.");
}
