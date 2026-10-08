/**
 * 70. Lowest Common Ancestor of a Binary Search Tree
 * LeetCode #235 | Difficulty: Medium | Category: Tree / BST
 *
 * Problem
 * -------
 * Given a binary search tree (BST) and two nodes `p` and `q` in it, return
 * their lowest common ancestor (LCA) - the lowest node in the tree that
 * has both p and q as descendants (a node can be a descendant of itself).
 *
 * Example
 * -------
 * Input: root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8
 * Output: 6
 *
 * Constraints
 * -----------
 * 2 <= number of nodes <= 10^5, all values unique, p and q both exist in
 * the tree.
 *
 * Approaches
 * ----------
 * 1. Brute force (`lowestCommonAncestorBruteForce`) - Ignore the BST property:
 *    find the root-to-p and root-to-q paths with DFS and return the last node
 *    they share. Works for any binary tree. O(n) time, O(n) space.
 * 2. Better (`lowestCommonAncestorBetter`) - Use the BST ordering recursively:
 *    if both values are smaller go left, if both larger go right, otherwise
 *    this node splits them. O(h) time, O(h) stack space.
 * 3. Optimal (`lowestCommonAncestorOptimal`) - Same BST logic as a loop, with
 *    no call stack. O(h) time, O(1) space.
 */
import assert from "node:assert/strict";
import { buildTree, findNode, TreeNode } from "../common/tree.ts";

/**
 * Ignore the BST property: find the root-to-p and root-to-q paths with DFS
 * and return the last node they share. Works for any binary tree.
 * O(n) time, O(n) space.
 */
export function lowestCommonAncestorBruteForce(root: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null {
  const pathTo = (node: TreeNode | null, target: TreeNode, path: TreeNode[]): boolean => {
    if (!node) return false;
    path.push(node);
    if (node === target || pathTo(node.left, target, path) || pathTo(node.right, target, path)) return true;
    path.pop();
    return false;
  };
  const pathP: TreeNode[] = [];
  const pathQ: TreeNode[] = [];
  if (!pathTo(root, p, pathP) || !pathTo(root, q, pathQ)) return null;
  let i = 0;
  while (i < pathP.length && i < pathQ.length && pathP[i] === pathQ[i]) i++;
  return pathP[i - 1];
}

/**
 * Use the BST ordering recursively: if both values are smaller go left,
 * if both larger go right, otherwise this node splits them.
 * O(h) time, O(h) stack space.
 */
export function lowestCommonAncestorBetter(root: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null {
  if (!root) return null;
  if (p.val < root.val && q.val < root.val) return lowestCommonAncestorBetter(root.left, p, q);
  if (p.val > root.val && q.val > root.val) return lowestCommonAncestorBetter(root.right, p, q);
  return root;
}

/** Same BST logic as a loop, with no call stack. O(h) time, O(1) space. */
export function lowestCommonAncestorOptimal(root: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null {
  let node = root;
  while (node) {
    if (p.val < node.val && q.val < node.val) node = node.left;
    else if (p.val > node.val && q.val > node.val) node = node.right;
    else return node;
  }
  return null;
}

if (import.meta.main) {
  const root = buildTree([6, 2, 8, 0, 4, 7, 9, null, null, 3, 5]);
  const tests: [number, number, number][] = [
    [2, 8, 6],
    [2, 4, 2],
    [0, 5, 2],
    [3, 5, 4],
  ];
  for (const [pVal, qVal, expected] of tests) {
    const p = findNode(root, pVal);
    const q = findNode(root, qVal);
    for (const fn of [lowestCommonAncestorBruteForce, lowestCommonAncestorBetter, lowestCommonAncestorOptimal]) {
      assert.equal(fn(root, p, q)?.val, expected, `${fn.name}(${pVal}, ${qVal})`);
    }
  }
  console.log("All Lowest Common Ancestor of a BST tests passed.");
}
