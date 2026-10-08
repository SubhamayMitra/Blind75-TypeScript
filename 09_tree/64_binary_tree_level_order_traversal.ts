/**
 * 64. Binary Tree Level Order Traversal
 * LeetCode #102 | Difficulty: Medium | Category: Tree
 *
 * Problem
 * -------
 * Given the root of a binary tree, return the level order traversal of
 * its nodes' values (i.e., from left to right, level by level).
 *
 * Example
 * -------
 * Input: root = [3,9,20,null,null,15,7]
 * Output: [[3],[9,20],[15,7]]
 *
 * Constraints
 * -----------
 * 0 <= number of nodes <= 2000
 *
 * Approaches
 * ----------
 * 1. Brute force (`levelOrderBruteForce`) - Pre-order DFS with a depth
 *    parameter, appending into result[depth]. O(n) time, O(n) space.
 * 2. Better (`levelOrderBetter`) - BFS whose queue holds (node, depth) pairs;
 *    group values by depth as they come out. O(n) time, O(n) space.
 * 3. Optimal (`levelOrderOptimal`) - BFS one whole level at a time: the
 *    current array is exactly one level. O(n) time, O(w) space.
 */
import assert from "node:assert/strict";
import { buildTree, TreeNode } from "../common/tree.ts";

/** Pre-order DFS with a depth parameter, appending into result[depth]. O(n) time, O(n) space. */
export function levelOrderBruteForce(root: TreeNode | null): number[][] {
  const result: number[][] = [];
  const dfs = (node: TreeNode | null, depth: number): void => {
    if (!node) return;
    (result[depth] ??= []).push(node.val);
    dfs(node.left, depth + 1);
    dfs(node.right, depth + 1);
  };
  dfs(root, 0);
  return result;
}

/** BFS whose queue holds (node, depth) pairs; group values by depth as they come out. O(n) time, O(n) space. */
export function levelOrderBetter(root: TreeNode | null): number[][] {
  const result: number[][] = [];
  const queue: [TreeNode, number][] = root ? [[root, 0]] : [];
  for (let head = 0; head < queue.length; head++) {
    const [node, depth] = queue[head];
    (result[depth] ??= []).push(node.val);
    if (node.left) queue.push([node.left, depth + 1]);
    if (node.right) queue.push([node.right, depth + 1]);
  }
  return result;
}

/** BFS one whole level at a time: the current array is exactly one level. O(n) time, O(w) space. */
export function levelOrderOptimal(root: TreeNode | null): number[][] {
  const result: number[][] = [];
  let level: TreeNode[] = root ? [root] : [];
  while (level.length > 0) {
    result.push(level.map((node) => node.val));
    level = level.flatMap((node) => [node.left, node.right].filter((child): child is TreeNode => child !== null));
  }
  return result;
}

if (import.meta.main) {
  const tests: [(number | null)[], number[][]][] = [
    [[3, 9, 20, null, null, 15, 7], [[3], [9, 20], [15, 7]]],
    [[1], [[1]]],
    [[], []],
  ];
  for (const [values, expected] of tests) {
    for (const fn of [levelOrderBruteForce, levelOrderBetter, levelOrderOptimal]) {
      assert.deepEqual(fn(buildTree(values)), expected, `${fn.name}(${JSON.stringify(values)})`);
    }
  }
  console.log("All Binary Tree Level Order Traversal tests passed.");
}
