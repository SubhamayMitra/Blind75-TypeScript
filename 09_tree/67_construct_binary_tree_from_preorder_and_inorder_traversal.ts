/**
 * 67. Construct Binary Tree from Preorder and Inorder Traversal
 * LeetCode #105 | Difficulty: Medium | Category: Tree
 *
 * Problem
 * -------
 * Given two integer arrays `preorder` and `inorder` where `preorder` is
 * the preorder traversal of a binary tree and `inorder` is the inorder
 * traversal of the same tree, construct and return the binary tree
 * (values are assumed unique).
 *
 * Example
 * -------
 * Input: preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
 * Output: [3,9,20,null,null,15,7]
 *
 * Constraints
 * -----------
 * 1 <= number of nodes <= 3000, all values unique
 *
 * Approaches
 * ----------
 * 1. Brute force (`buildTreeBruteForce`) - preorder[0] is the root; find it in
 *    inorder with a linear `indexOf`, then recurse on sliced copies of both
 *    arrays. O(n^2) time, O(n^2) space in the worst case (slices).
 * 2. Better (`buildTreeBetter`) - Precompute value -> inorder index for O(1)
 *    split lookups, but still slice the preorder array on every call. O(n^2)
 *    worst-case time from slicing (O(n log n) for balanced trees), O(n) space
 *    for the map.
 * 3. Optimal (`buildTreeOptimal`) - Index map for O(1) splits AND no slicing:
 *    a shared preorder pointer plus (lo, hi) bounds into inorder, so each call
 *    does O(1) work. O(n) time, O(n) space.
 */
import assert from "node:assert/strict";
import { TreeNode, treeToArray } from "../common/tree.ts";

/**
 * preorder[0] is the root; find it in inorder with a linear `indexOf`,
 * then recurse on sliced copies of both arrays. O(n^2) time, O(n^2) space
 * in the worst case (slices).
 */
export function buildTreeBruteForce(preorder: number[], inorder: number[]): TreeNode | null {
  if (preorder.length === 0) return null;
  const root = new TreeNode(preorder[0]);
  const mid = inorder.indexOf(preorder[0]);
  root.left = buildTreeBruteForce(preorder.slice(1, mid + 1), inorder.slice(0, mid));
  root.right = buildTreeBruteForce(preorder.slice(mid + 1), inorder.slice(mid + 1));
  return root;
}

/**
 * Precompute value -> inorder index for O(1) split lookups, but still
 * slice the preorder array on every call. O(n^2) worst-case time from
 * slicing (O(n log n) for balanced trees), O(n) space for the map.
 */
export function buildTreeBetter(preorder: number[], inorder: number[]): TreeNode | null {
  const indexOf = new Map(inorder.map((val, i) => [val, i]));
  const build = (pre: number[], inLo: number): TreeNode | null => {
    if (pre.length === 0) return null;
    const root = new TreeNode(pre[0]);
    const leftSize = indexOf.get(pre[0])! - inLo;
    root.left = build(pre.slice(1, leftSize + 1), inLo);
    root.right = build(pre.slice(leftSize + 1), inLo + leftSize + 1);
    return root;
  };
  return build(preorder, 0);
}

/**
 * Index map for O(1) splits AND no slicing: a shared preorder pointer
 * plus (lo, hi) bounds into inorder, so each call does O(1) work.
 * O(n) time, O(n) space.
 */
export function buildTreeOptimal(preorder: number[], inorder: number[]): TreeNode | null {
  const indexOf = new Map(inorder.map((val, i) => [val, i]));
  let preIndex = 0;
  const build = (lo: number, hi: number): TreeNode | null => {
    if (lo > hi) return null;
    const val = preorder[preIndex++];
    const mid = indexOf.get(val)!;
    const root = new TreeNode(val);
    root.left = build(lo, mid - 1);
    root.right = build(mid + 1, hi);
    return root;
  };
  return build(0, inorder.length - 1);
}

if (import.meta.main) {
  const tests: [number[], number[], (number | null)[]][] = [
    [[3, 9, 20, 15, 7], [9, 3, 15, 20, 7], [3, 9, 20, null, null, 15, 7]],
    [[-1], [-1], [-1]],
    [[1, 2], [2, 1], [1, 2]],
    [[1, 2, 3], [1, 2, 3], [1, null, 2, null, 3]],
  ];
  for (const [preorder, inorder, expected] of tests) {
    for (const fn of [buildTreeBruteForce, buildTreeBetter, buildTreeOptimal]) {
      assert.deepEqual(treeToArray(fn([...preorder], [...inorder])), expected, `${fn.name}(${JSON.stringify(preorder)})`);
    }
  }
  console.log("All Construct Binary Tree from Preorder and Inorder Traversal tests passed.");
}
