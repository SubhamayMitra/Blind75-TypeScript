/**
 * 33. Graph Valid Tree
 * LeetCode #261 (Premium) | Difficulty: Medium | Category: Graph
 *
 * Problem
 * -------
 * Given `n` nodes labeled 0 to n-1 and a list of undirected `edges`,
 * return true if these edges form a valid tree (connected, and exactly
 * n - 1 edges with no cycles).
 *
 * Example
 * -------
 * Input: n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]
 * Output: true
 *
 * Constraints
 * -----------
 * 1 <= n <= 2000
 *
 * Approaches
 * ----------
 * 1. Brute force (`validTreeBruteForce`) - Two explicit checks: (1) DFS from
 *    node 0 must never reach an already-visited node other than its parent (no
 *    cycle), and (2) the DFS must visit all n nodes (connected). O(V + E)
 *    time, O(V + E) space.
 * 2. Better (`validTreeBetter`) - Naive union-find (no path compression, no
 *    union by rank). A tree has exactly n - 1 edges and no edge joins two
 *    nodes already connected. O(E * V) worst-case time, O(V) space.
 * 3. Optimal (`validTreeOptimal`) - Union-find with path compression and union
 *    by rank for near-constant amortised operations. O(E * α(V)) ≈ O(E) time,
 *    O(V) space.
 */
import assert from "node:assert/strict";

/**
 * Two explicit checks: (1) DFS from node 0 must never reach an
 * already-visited node other than its parent (no cycle), and (2) the DFS
 * must visit all n nodes (connected). O(V + E) time, O(V + E) space.
 */
export function validTreeBruteForce(n: number, edges: number[][]): boolean {
  const graph: number[][] = Array.from({ length: n }, () => []);
  for (const [a, b] of edges) {
    graph[a].push(b);
    graph[b].push(a);
  }
  const visited = new Set<number>();
  const hasCycle = (node: number, parent: number): boolean => {
    visited.add(node);
    for (const next of graph[node]) {
      if (next === parent) continue;
      if (visited.has(next) || hasCycle(next, node)) return true;
    }
    return false;
  };
  if (hasCycle(0, -1)) return false;
  return visited.size === n;
}

/**
 * Naive union-find (no path compression, no union by rank). A tree has
 * exactly n - 1 edges and no edge joins two nodes already connected.
 * O(E * V) worst-case time, O(V) space.
 */
export function validTreeBetter(n: number, edges: number[][]): boolean {
  if (edges.length !== n - 1) return false;
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x: number): number => {
    while (parent[x] !== x) x = parent[x];
    return x;
  };
  for (const [a, b] of edges) {
    const ra = find(a);
    const rb = find(b);
    if (ra === rb) return false;
    parent[ra] = rb;
  }
  return true;
}

/**
 * Union-find with path compression and union by rank for near-constant
 * amortised operations. O(E * α(V)) ≈ O(E) time, O(V) space.
 */
export function validTreeOptimal(n: number, edges: number[][]): boolean {
  if (edges.length !== n - 1) return false;
  const parent = Array.from({ length: n }, (_, i) => i);
  const rank: number[] = new Array(n).fill(0);
  const find = (x: number): number => {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  };
  for (const [a, b] of edges) {
    let ra = find(a);
    let rb = find(b);
    if (ra === rb) return false;
    if (rank[ra] < rank[rb]) [ra, rb] = [rb, ra];
    parent[rb] = ra;
    if (rank[ra] === rank[rb]) rank[ra]++;
  }
  return true;
}

if (import.meta.main) {
  const tests: [number, number[][], boolean][] = [
    [5, [[0, 1], [0, 2], [0, 3], [1, 4]], true],
    [5, [[0, 1], [1, 2], [2, 3], [1, 3], [1, 4]], false],
    [1, [], true],
    [2, [[0, 1]], true],
    [4, [[0, 1], [2, 3]], false],
  ];
  for (const [n, edges, expected] of tests) {
    for (const fn of [validTreeBruteForce, validTreeBetter, validTreeOptimal]) {
      assert.equal(fn(n, edges), expected, `${fn.name}(${n}, ${JSON.stringify(edges)})`);
    }
  }
  console.log("All Graph Valid Tree tests passed.");
}
