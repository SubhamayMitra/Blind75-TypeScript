/**
 * 62. Invert/Flip Binary Tree
 * LeetCode #226 | Difficulty: Easy | Category: Tree
 *
 * Problem
 * -------
 * Given the root of a binary tree, invert the tree (mirror it: swap every
 * node's left and right children), and return its root.
 *
 * Example
 * -------
 * Input: root = [4,2,7,1,3,6,9]
 * Output: [4,7,2,9,6,3,1]
 *
 * Constraints
 * -----------
 * 0 <= number of nodes <= 100
 *
 * Approaches
 * ----------
 * 1. Brute force (`invertTreeBruteForce`) - Collect every node with BFS first,
 *    then swap children on each in a second pass. O(n) time, O(n) space.
 * 2. Better (`invertTreeBetter`) - BFS that swaps each node's children as it
 *    is dequeued. O(n) time, O(w) space.
 * 3. Optimal (`invertTreeOptimal`) - Recursively invert both subtrees and swap
 *    them. O(n) time, O(h) stack space.
 */
import assert from "node:assert/strict";
import { buildTree, TreeNode, treeToArray } from "../common/tree.ts";

/** Collect every node with BFS first, then swap children on each in a second pass. O(n) time, O(n) space. */
export function invertTreeBruteForce(root: TreeNode | null): TreeNode | null {
  const nodes: TreeNode[] = root ? [root] : [];
  for (let i = 0; i < nodes.length; i++) {
    const { left, right } = nodes[i];
    if (left) nodes.push(left);
    if (right) nodes.push(right);
  }
  for (const node of nodes) [node.left, node.right] = [node.right, node.left];
  return root;
}

/** BFS that swaps each node's children as it is dequeued. O(n) time, O(w) space. */
export function invertTreeBetter(root: TreeNode | null): TreeNode | null {
  const queue: TreeNode[] = root ? [root] : [];
  for (let head = 0; head < queue.length; head++) {
    const node = queue[head];
    [node.left, node.right] = [node.right, node.left];
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  return root;
}

/** Recursively invert both subtrees and swap them. O(n) time, O(h) stack space. */
export function invertTreeOptimal(root: TreeNode | null): TreeNode | null {
  if (!root) return null;
  [root.left, root.right] = [invertTreeOptimal(root.right), invertTreeOptimal(root.left)];
  return root;
}

if (import.meta.main) {
  const tests: [(number | null)[], (number | null)[]][] = [
    [[4, 2, 7, 1, 3, 6, 9], [4, 7, 2, 9, 6, 3, 1]],
    [[2, 1, 3], [2, 3, 1]],
    [[], []],
    [[1, 2], [1, null, 2]],
  ];
  for (const [values, expected] of tests) {
    for (const fn of [invertTreeBruteForce, invertTreeBetter, invertTreeOptimal]) {
      assert.deepEqual(treeToArray(fn(buildTree(values))), expected, `${fn.name}(${JSON.stringify(values)})`);
    }
  }
  console.log("All Invert Binary Tree tests passed.");
}
