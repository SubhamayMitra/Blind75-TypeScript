/**
 * 66. Subtree of Another Tree
 * LeetCode #572 | Difficulty: Easy | Category: Tree
 *
 * Problem
 * -------
 * Given the roots of two binary trees `root` and `subRoot`, return true if
 * there is a subtree of `root` with the same structure and node values as
 * `subRoot`. A subtree of a tree is a tree consisting of a node in the
 * tree and all of that node's descendants.
 *
 * Example
 * -------
 * Input: root = [3,4,5,1,2], subRoot = [4,1,2]
 * Output: true
 *
 * Constraints
 * -----------
 * 1 <= number of nodes in root <= 2000
 * 1 <= number of nodes in subRoot <= 1000
 *
 * Approaches
 * ----------
 * 1. Brute force (`isSubtreeBruteForce`) - Serialize both trees in preorder
 *    with null markers and explicit separators around every value (so "2"
 *    can't match inside "12"), then check for a substring. O(n*m) time
 *    (substring search), O(n+m) space.
 * 2. Better (`isSubtreeBetter`) - For every node in root, run a full same-tree
 *    comparison against subRoot. O(n*m) time, O(h) space.
 * 3. Optimal (`isSubtreeOptimal`) - Same candidate-by-candidate strategy, but
 *    skip the full comparison unless the candidate's value matches subRoot's
 *    root value. O(n*m) worst-case time with better constant-factor pruning,
 *    O(h) space.
 */
import assert from "node:assert/strict";
import { buildTree, TreeNode } from "../common/tree.ts";

function isSame(a: TreeNode | null, b: TreeNode | null): boolean {
  if (!a || !b) return a === b;
  return a.val === b.val && isSame(a.left, b.left) && isSame(a.right, b.right);
}

/**
 * Serialize both trees in preorder with null markers and explicit
 * separators around every value (so "2" can't match inside "12"), then
 * check for a substring. O(n*m) time (substring search), O(n+m) space.
 */
export function isSubtreeBruteForce(root: TreeNode | null, subRoot: TreeNode | null): boolean {
  const serialize = (node: TreeNode | null): string =>
    node ? `^${node.val}${serialize(node.left)}${serialize(node.right)}` : "^#";
  return serialize(root).includes(serialize(subRoot));
}

/** For every node in root, run a full same-tree comparison against subRoot. O(n*m) time, O(h) space. */
export function isSubtreeBetter(root: TreeNode | null, subRoot: TreeNode | null): boolean {
  if (!subRoot) return true;
  if (!root) return false;
  return isSame(root, subRoot) || isSubtreeBetter(root.left, subRoot) || isSubtreeBetter(root.right, subRoot);
}

/**
 * Same candidate-by-candidate strategy, but skip the full comparison
 * unless the candidate's value matches subRoot's root value.
 * O(n*m) worst-case time with better constant-factor pruning, O(h) space.
 */
export function isSubtreeOptimal(root: TreeNode | null, subRoot: TreeNode | null): boolean {
  if (!subRoot) return true;
  const stack: (TreeNode | null)[] = [root];
  while (stack.length > 0) {
    const node = stack.pop();
    if (!node) continue;
    if (node.val === subRoot.val && isSame(node, subRoot)) return true;
    stack.push(node.left, node.right);
  }
  return false;
}

if (import.meta.main) {
  const tests: [(number | null)[], (number | null)[], boolean][] = [
    [[3, 4, 5, 1, 2], [4, 1, 2], true],
    [[3, 4, 5, 1, 2, null, null, null, null, 0], [4, 1, 2], false],
    [[1], [1], true],
    [[12], [2], false],
  ];
  for (const [rootValues, subValues, expected] of tests) {
    for (const fn of [isSubtreeBruteForce, isSubtreeBetter, isSubtreeOptimal]) {
      assert.equal(
        fn(buildTree(rootValues), buildTree(subValues)),
        expected,
        `${fn.name}(${JSON.stringify(rootValues)}, ${JSON.stringify(subValues)})`,
      );
    }
  }
  console.log("All Subtree of Another Tree tests passed.");
}
