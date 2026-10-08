/**
 * 63. Binary Tree Maximum Path Sum
 * LeetCode #124 | Difficulty: Hard | Category: Tree
 *
 * Problem
 * -------
 * A path in a binary tree is a sequence of nodes connected by edges,
 * where each node appears at most once, and the path does not need to
 * pass through the root. Given the root of a binary tree, return the
 * maximum path sum of any non-empty path.
 *
 * Example
 * -------
 * Input: root = [-10,9,20,null,null,15,7]
 * Output: 42          // path 15 -> 20 -> 7
 *
 * Constraints
 * -----------
 * 1 <= number of nodes <= 3 * 10^4
 *
 * Approaches
 * ----------
 * 1. Brute force (`maxPathSumBruteForce`) - Treat every node as the path's
 *    highest point; for each one, compute the best downward sum from each
 *    child with a separate recursive call (no caching, so downward sums are
 *    recomputed many times). O(n^2) worst-case time, O(h) space.
 * 2. Better (`maxPathSumBetter`) - Iterative post-order: compute every node's
 *    best downward gain once, children before parents, storing gains in a Map.
 *    O(n) time, O(n) space.
 * 3. Optimal (`maxPathSumOptimal`) - Single recursive DFS: return the best
 *    one-sided (downward) gain to the parent while updating a closure variable
 *    with the best path that bends through the current node. Negative gains
 *    are dropped (clamped to 0). O(n) time, O(h) stack space.
 */
import assert from "node:assert/strict";
import { buildTree, TreeNode } from "../common/tree.ts";

/**
 * Treat every node as the path's highest point; for each one, compute the
 * best downward sum from each child with a separate recursive call (no
 * caching, so downward sums are recomputed many times).
 * O(n^2) worst-case time, O(h) space.
 */
export function maxPathSumBruteForce(root: TreeNode | null): number {
  const bestDown = (node: TreeNode | null): number => {
    if (!node) return 0;
    return node.val + Math.max(0, bestDown(node.left), bestDown(node.right));
  };
  let best = -Infinity;
  const stack: (TreeNode | null)[] = [root];
  while (stack.length > 0) {
    const node = stack.pop();
    if (!node) continue;
    best = Math.max(best, node.val + Math.max(0, bestDown(node.left)) + Math.max(0, bestDown(node.right)));
    stack.push(node.left, node.right);
  }
  return best;
}

/**
 * Iterative post-order: compute every node's best downward gain once,
 * children before parents, storing gains in a Map. O(n) time, O(n) space.
 */
export function maxPathSumBetter(root: TreeNode | null): number {
  if (!root) return 0;
  const order: TreeNode[] = [];
  const stack: TreeNode[] = [root];
  while (stack.length > 0) {
    const node = stack.pop()!;
    order.push(node);
    if (node.left) stack.push(node.left);
    if (node.right) stack.push(node.right);
  }

  const gain = new Map<TreeNode | null, number>([[null, 0]]);
  let best = -Infinity;
  // reversed pre-order visits every child before its parent
  for (let i = order.length - 1; i >= 0; i--) {
    const node = order[i];
    const left = Math.max(0, gain.get(node.left)!);
    const right = Math.max(0, gain.get(node.right)!);
    best = Math.max(best, node.val + left + right);
    gain.set(node, node.val + Math.max(left, right));
  }
  return best;
}

/**
 * Single recursive DFS: return the best one-sided (downward) gain to the
 * parent while updating a closure variable with the best path that bends
 * through the current node. Negative gains are dropped (clamped to 0).
 * O(n) time, O(h) stack space.
 */
export function maxPathSumOptimal(root: TreeNode | null): number {
  let best = -Infinity;
  const gain = (node: TreeNode | null): number => {
    if (!node) return 0;
    const left = Math.max(0, gain(node.left));
    const right = Math.max(0, gain(node.right));
    best = Math.max(best, node.val + left + right);
    return node.val + Math.max(left, right);
  };
  gain(root);
  return best;
}

if (import.meta.main) {
  const tests: [(number | null)[], number][] = [
    [[1, 2, 3], 6],
    [[-10, 9, 20, null, null, 15, 7], 42],
    [[-3], -3],
    [[2, -1], 2],
    [[5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1], 48],
  ];
  for (const [values, expected] of tests) {
    for (const fn of [maxPathSumBruteForce, maxPathSumBetter, maxPathSumOptimal]) {
      assert.equal(fn(buildTree(values)), expected, `${fn.name}(${JSON.stringify(values)})`);
    }
  }
  console.log("All Binary Tree Maximum Path Sum tests passed.");
}
