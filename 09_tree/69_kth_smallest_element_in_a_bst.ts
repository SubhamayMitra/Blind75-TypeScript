/**
 * 69. Kth Smallest Element in a BST
 * LeetCode #230 | Difficulty: Medium | Category: Tree / BST
 *
 * Problem
 * -------
 * Given the root of a binary search tree and an integer `k`, return the
 * kth smallest value (1-indexed) among all the values of the nodes.
 *
 * Example
 * -------
 * Input: root = [3,1,4,null,2], k = 1
 * Output: 1
 *
 * Constraints
 * -----------
 * 1 <= number of nodes <= 10^4, 1 <= k <= number of nodes
 *
 * Approaches
 * ----------
 * 1. Brute force (`kthSmallestBruteForce`) - Full recursive inorder traversal
 *    into an array, then index k - 1. O(n) time, O(n) space.
 * 2. Better (`kthSmallestBetter`) - Iterative inorder with an explicit stack
 *    over the whole tree, remembering the kth value. O(n) time, O(h) space.
 * 3. Optimal (`kthSmallestOptimal`) - Iterative inorder that stops as soon as
 *    the kth node is popped. O(h + k) time, O(h) space.
 */
import assert from "node:assert/strict";
import { buildTree, TreeNode } from "../common/tree.ts";

/** Full recursive inorder traversal into an array, then index k - 1. O(n) time, O(n) space. */
export function kthSmallestBruteForce(root: TreeNode | null, k: number): number {
  const values: number[] = [];
  const inorder = (node: TreeNode | null): void => {
    if (!node) return;
    inorder(node.left);
    values.push(node.val);
    inorder(node.right);
  };
  inorder(root);
  return values[k - 1];
}

/** Iterative inorder with an explicit stack over the whole tree, remembering the kth value. O(n) time, O(h) space. */
export function kthSmallestBetter(root: TreeNode | null, k: number): number {
  const stack: TreeNode[] = [];
  let node = root;
  let count = 0;
  let answer = -1;
  while (node || stack.length > 0) {
    while (node) {
      stack.push(node);
      node = node.left;
    }
    node = stack.pop()!;
    if (++count === k) answer = node.val;
    node = node.right;
  }
  return answer;
}

/** Iterative inorder that stops as soon as the kth node is popped. O(h + k) time, O(h) space. */
export function kthSmallestOptimal(root: TreeNode | null, k: number): number {
  const stack: TreeNode[] = [];
  let node = root;
  while (node || stack.length > 0) {
    while (node) {
      stack.push(node);
      node = node.left;
    }
    node = stack.pop()!;
    if (--k === 0) return node.val;
    node = node.right;
  }
  return -1;
}

if (import.meta.main) {
  const tests: [(number | null)[], number, number][] = [
    [[3, 1, 4, null, 2], 1, 1],
    [[5, 3, 6, 2, 4, null, null, 1], 3, 3],
    [[1], 1, 1],
    [[5, 3, 6, 2, 4, null, null, 1], 6, 6],
  ];
  for (const [values, k, expected] of tests) {
    for (const fn of [kthSmallestBruteForce, kthSmallestBetter, kthSmallestOptimal]) {
      assert.equal(fn(buildTree(values), k), expected, `${fn.name}(${JSON.stringify(values)}, ${k})`);
    }
  }
  console.log("All Kth Smallest Element in a BST tests passed.");
}
