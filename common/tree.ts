/** Binary tree node, matching LeetCode's `TreeNode` definition. */
export class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;

  constructor(val = 0, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

/**
 * Build a tree from LeetCode's level-order array format, where `null`
 * marks a missing child, e.g. [3, 9, 20, null, null, 15, 7].
 */
export function buildTree(values: (number | null)[]): TreeNode | null {
  if (values.length === 0 || values[0] === null) return null;
  const root = new TreeNode(values[0]);
  const queue: TreeNode[] = [root];
  let head = 0;
  let i = 1;
  while (head < queue.length && i < values.length) {
    const node = queue[head++];
    const left = values[i++];
    if (left !== null && left !== undefined) {
      node.left = new TreeNode(left);
      queue.push(node.left);
    }
    if (i < values.length) {
      const right = values[i++];
      if (right !== null && right !== undefined) {
        node.right = new TreeNode(right);
        queue.push(node.right);
      }
    }
  }
  return root;
}

/** Inverse of `buildTree`: level-order array with trailing nulls trimmed. */
export function treeToArray(root: TreeNode | null): (number | null)[] {
  if (!root) return [];
  const result: (number | null)[] = [];
  const queue: (TreeNode | null)[] = [root];
  for (let head = 0; head < queue.length; head++) {
    const node = queue[head];
    if (node === null) {
      result.push(null);
      continue;
    }
    result.push(node.val);
    queue.push(node.left, node.right);
  }
  while (result.length > 0 && result[result.length - 1] === null) result.pop();
  return result;
}

/** Find the first node with the given value (DFS); throws if absent. */
export function findNode(root: TreeNode | null, val: number): TreeNode {
  const stack: (TreeNode | null)[] = [root];
  while (stack.length > 0) {
    const node = stack.pop();
    if (!node) continue;
    if (node.val === val) return node;
    stack.push(node.left, node.right);
  }
  throw new Error(`node ${val} not found`);
}
