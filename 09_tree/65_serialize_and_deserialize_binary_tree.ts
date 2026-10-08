/**
 * 65. Serialize and Deserialize Binary Tree
 * LeetCode #297 | Difficulty: Hard | Category: Tree
 *
 * Problem
 * -------
 * Design an algorithm to serialize a binary tree to a string, and
 * deserialize that string back into the original tree structure.
 *
 * Example
 * -------
 * Input: root = [1,2,3,null,null,4,5]
 * Serialized -> some string representation
 * Deserialized -> the same tree structure back
 *
 * Constraints
 * -----------
 * 0 <= number of nodes <= 10^4
 *
 * Approaches
 * ----------
 * 1. Brute force (`CodecBruteForce`) - Level-order (BFS) serialization with
 *    "#" placeholders for missing children. O(n) time, O(n) space.
 * 2. Better (`CodecBetter`) - Preorder DFS with "#" for nulls; deserialize
 *    with a manual index into the split tokens. O(n) time, O(n) space.
 * 3. Optimal (`CodecOptimal`) - Preorder DFS with "#" for nulls; deserialize
 *    by pulling tokens from an iterator, so no index bookkeeping is needed.
 *    O(n) time, O(n) space.
 */
import assert from "node:assert/strict";
import { buildTree, TreeNode, treeToArray } from "../common/tree.ts";

interface Codec {
  serialize(root: TreeNode | null): string;
  deserialize(data: string): TreeNode | null;
}

/** Level-order (BFS) serialization with "#" placeholders for missing children. O(n) time, O(n) space. */
export class CodecBruteForce implements Codec {
  serialize(root: TreeNode | null): string {
    if (!root) return "";
    const result: string[] = [];
    const queue: (TreeNode | null)[] = [root];
    for (let head = 0; head < queue.length; head++) {
      const node = queue[head];
      if (!node) {
        result.push("#");
        continue;
      }
      result.push(String(node.val));
      queue.push(node.left, node.right);
    }
    return result.join(",");
  }

  deserialize(data: string): TreeNode | null {
    if (data === "") return null;
    const values = data.split(",");
    const root = new TreeNode(Number(values[0]));
    const queue: TreeNode[] = [root];
    let i = 1;
    for (let head = 0; head < queue.length && i < values.length; head++) {
      const node = queue[head];
      if (values[i] !== "#") queue.push((node.left = new TreeNode(Number(values[i]))));
      i++;
      if (i < values.length && values[i] !== "#") queue.push((node.right = new TreeNode(Number(values[i]))));
      i++;
    }
    return root;
  }
}

function serializePreorder(root: TreeNode | null): string {
  const result: string[] = [];
  const dfs = (node: TreeNode | null): void => {
    if (!node) {
      result.push("#");
      return;
    }
    result.push(String(node.val));
    dfs(node.left);
    dfs(node.right);
  };
  dfs(root);
  return result.join(",");
}

/** Preorder DFS with "#" for nulls; deserialize with a manual index into the split tokens. O(n) time, O(n) space. */
export class CodecBetter implements Codec {
  serialize(root: TreeNode | null): string {
    return serializePreorder(root);
  }

  deserialize(data: string): TreeNode | null {
    const values = data.split(",");
    let index = 0;
    const build = (): TreeNode | null => {
      const val = values[index++];
      if (val === "#") return null;
      const node = new TreeNode(Number(val));
      node.left = build();
      node.right = build();
      return node;
    };
    return build();
  }
}

/**
 * Preorder DFS with "#" for nulls; deserialize by pulling tokens from an
 * iterator, so no index bookkeeping is needed. O(n) time, O(n) space.
 */
export class CodecOptimal implements Codec {
  serialize(root: TreeNode | null): string {
    return serializePreorder(root);
  }

  deserialize(data: string): TreeNode | null {
    const tokens = data.split(",")[Symbol.iterator]();
    const build = (): TreeNode | null => {
      const val = tokens.next().value;
      if (val === undefined || val === "#") return null;
      return new TreeNode(Number(val), build(), build());
    };
    return build();
  }
}

if (import.meta.main) {
  const tests: (number | null)[][] = [
    [1, 2, 3, null, null, 4, 5],
    [],
    [1],
    [1, 2],
    [-1, null, -20, 300],
  ];
  for (const values of tests) {
    for (const CodecClass of [CodecBruteForce, CodecBetter, CodecOptimal]) {
      const codec = new CodecClass();
      const restored = codec.deserialize(codec.serialize(buildTree(values)));
      assert.deepEqual(treeToArray(restored), values, `${CodecClass.name}(${JSON.stringify(values)})`);
    }
  }
  console.log("All Serialize and Deserialize Binary Tree tests passed.");
}
