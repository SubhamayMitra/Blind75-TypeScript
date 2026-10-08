/**
 * 68. Validate Binary Search Tree
 * LeetCode #98 | Difficulty: Medium | Category: Tree / BST
 *
 * Problem
 * -------
 * Given the root of a binary tree, determine if it is a valid binary
 * search tree (BST): for every node, all values in its left subtree are
 * strictly less than the node's value, and all values in its right
 * subtree are strictly greater.
 *
 * Example
 * -------
 * Input: root = [2,1,3]
 * Output: true
 *
 * Constraints
 * -----------
 * 1 <= number of nodes <= 10^4
 *
 * Approaches
 * ----------
 * 1. Brute force (`isValidBstBruteForce`) - For every node, gather all values
 *    in its left and right subtrees and check them directly against the node's
 *    value. O(n^2) time, O(n) space.
 * 2. Better (`isValidBstBetter`) - Inorder traversal into an array, then check
 *    it is strictly increasing. O(n) time, O(n) space.
 * 3. Optimal (`isValidBstOptimal`) - DFS carrying an exclusive (low, high)
 *    bound that narrows on each step down. O(n) time, O(h) stack space.
 */
import assert from "node:assert/strict";
import { buildTree, TreeNode } from "../common/tree.ts";

function collect(node: TreeNode | null, out: number[] = []): number[] {
  if (node) {
    out.push(node.val);
    collect(node.left, out);
    collect(node.right, out);
  }
  return out;
}

/**
 * For every node, gather all values in its left and right subtrees and
 * check them directly against the node's value. O(n^2) time, O(n) space.
 */
export function isValidBstBruteForce(root: TreeNode | null): boolean {
  if (!root) return true;
  if (collect(root.left).some((v) => v >= root.val)) return false;
  if (collect(root.right).some((v) => v <= root.val)) return false;
  return isValidBstBruteForce(root.left) && isValidBstBruteForce(root.right);
}

/** Inorder traversal into an array, then check it is strictly increasing. O(n) time, O(n) space. */
export function isValidBstBetter(root: TreeNode | null): boolean {
  const values: number[] = [];
  const inorder = (node: TreeNode | null): void => {
    if (!node) return;
    inorder(node.left);
    values.push(node.val);
    inorder(node.right);
  };
  inorder(root);
  return values.every((v, i) => i === 0 || values[i - 1] < v);
}

/** DFS carrying an exclusive (low, high) bound that narrows on each step down. O(n) time, O(h) stack space. */
export function isValidBstOptimal(root: TreeNode | null, low = -Infinity, high = Infinity): boolean {
  if (!root) return true;
  if (root.val <= low || root.val >= high) return false;
  return isValidBstOptimal(root.left, low, root.val) && isValidBstOptimal(root.right, root.val, high);
}

if (import.meta.main) {
  const tests: [(number | null)[], boolean][] = [
    [[2, 1, 3], true],
    [[5, 1, 4, null, null, 3, 6], false],
    [[1], true],
    [[2, 2, 2], false],
    [[5, 4, 6, null, null, 3, 7], false],
  ];
  for (const [values, expected] of tests) {
    for (const fn of [isValidBstBruteForce, isValidBstBetter, isValidBstOptimal]) {
      assert.equal(fn(buildTree(values)), expected, `${fn.name}(${JSON.stringify(values)})`);
    }
  }
  console.log("All Validate Binary Search Tree tests passed.");
}
