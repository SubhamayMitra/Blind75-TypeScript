/**
 * 27. Clone Graph
 * LeetCode #133 | Difficulty: Medium | Category: Graph
 *
 * Problem
 * -------
 * Given a reference to a node in a connected undirected graph, return a
 * deep copy (clone) of the graph. Each node has an integer value and a
 * list of neighbors.
 *
 * Example
 * -------
 * Input: adjList = [[2,4],[1,3],[2,4],[1,3]]   // node 1 connects to 2 & 4, etc.
 * Output: a structurally identical graph made of brand-new Node objects.
 *
 * Constraints
 * -----------
 * 0 <= number of nodes <= 100, no repeated edges, graph is connected.
 *
 * Approaches
 * ----------
 * 1. Brute force (`cloneGraphBruteForce`) - DFS that records (original, clone)
 *    pairs in a plain array and finds an existing clone by linear search
 *    instead of a hash map. O(V^2 + E) time, O(V) space.
 * 2. Better (`cloneGraphBetter`) - BFS with a Map from original node -> clone
 *    to avoid re-cloning and break cycles. O(V + E) time, O(V) space.
 * 3. Optimal (`cloneGraphOptimal`) - Recursive DFS with the same Map
 *    memoization; the most compact solution. O(V + E) time, O(V) space.
 */
import assert from "node:assert/strict";

/** Undirected graph node, matching LeetCode's `_Node` definition. */
export class GraphNode {
  val: number;
  neighbors: GraphNode[];

  constructor(val = 0, neighbors: GraphNode[] = []) {
    this.val = val;
    this.neighbors = neighbors;
  }
}

/**
 * DFS that records (original, clone) pairs in a plain array and finds an
 * existing clone by linear search instead of a hash map.
 * O(V^2 + E) time, O(V) space.
 */
export function cloneGraphBruteForce(node: GraphNode | null): GraphNode | null {
  if (!node) return null;
  const pairs: [GraphNode, GraphNode][] = [];
  const clone = (original: GraphNode): GraphNode => {
    const existing = pairs.find(([orig]) => orig === original);
    if (existing) return existing[1];
    const copy = new GraphNode(original.val);
    pairs.push([original, copy]);
    for (const neighbor of original.neighbors) copy.neighbors.push(clone(neighbor));
    return copy;
  };
  return clone(node);
}

/** BFS with a Map from original node -> clone to avoid re-cloning and break cycles. O(V + E) time, O(V) space. */
export function cloneGraphBetter(node: GraphNode | null): GraphNode | null {
  if (!node) return null;
  const clones = new Map<GraphNode, GraphNode>([[node, new GraphNode(node.val)]]);
  const queue: GraphNode[] = [node];
  for (let head = 0; head < queue.length; head++) {
    const current = queue[head];
    const copy = clones.get(current)!;
    for (const neighbor of current.neighbors) {
      let neighborCopy = clones.get(neighbor);
      if (!neighborCopy) {
        neighborCopy = new GraphNode(neighbor.val);
        clones.set(neighbor, neighborCopy);
        queue.push(neighbor);
      }
      copy.neighbors.push(neighborCopy);
    }
  }
  return clones.get(node)!;
}

/** Recursive DFS with the same Map memoization; the most compact solution. O(V + E) time, O(V) space. */
export function cloneGraphOptimal(node: GraphNode | null): GraphNode | null {
  const clones = new Map<GraphNode, GraphNode>();
  const clone = (original: GraphNode | null): GraphNode | null => {
    if (!original) return null;
    const existing = clones.get(original);
    if (existing) return existing;
    const copy = new GraphNode(original.val);
    clones.set(original, copy);
    copy.neighbors = original.neighbors.map((n) => clone(n)!);
    return copy;
  };
  return clone(node);
}

/** Build a graph from a 1-indexed adjacency list; returns node 1. */
function buildGraph(adjList: number[][]): GraphNode | null {
  if (adjList.length === 0) return null;
  const nodes = adjList.map((_, i) => new GraphNode(i + 1));
  adjList.forEach((neighbors, i) => {
    nodes[i].neighbors = neighbors.map((v) => nodes[v - 1]);
  });
  return nodes[0];
}

/** Collect every reachable node (identity-based) and return the adjacency list. */
function toAdjList(node: GraphNode | null): { adj: number[][]; nodes: Set<GraphNode> } {
  const nodes = new Set<GraphNode>();
  const stack: GraphNode[] = node ? [node] : [];
  while (stack.length > 0) {
    const current = stack.pop()!;
    if (nodes.has(current)) continue;
    nodes.add(current);
    stack.push(...current.neighbors);
  }
  const adj: number[][] = [];
  for (const n of nodes) adj[n.val - 1] = n.neighbors.map((nb) => nb.val);
  return { adj, nodes };
}

if (import.meta.main) {
  const tests: number[][][] = [
    [[2, 4], [1, 3], [2, 4], [1, 3]],
    [[]],
    [],
  ];
  for (const adjList of tests) {
    for (const fn of [cloneGraphBruteForce, cloneGraphBetter, cloneGraphOptimal]) {
      const original = buildGraph(adjList);
      const cloned = fn(original);
      const a = toAdjList(original);
      const b = toAdjList(cloned);
      assert.deepEqual(b.adj, adjList, fn.name);
      // must be a deep copy: no node object shared with the original
      for (const n of b.nodes) assert.ok(!a.nodes.has(n), `${fn.name} shares a node`);
    }
  }
  console.log("All Clone Graph tests passed.");
}
