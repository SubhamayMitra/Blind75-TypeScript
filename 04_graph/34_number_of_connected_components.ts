/**
 * 34. Number of Connected Components in an Undirected Graph
 * LeetCode #323 (Premium) | Difficulty: Medium | Category: Graph
 *
 * Problem
 * -------
 * Given `n` nodes labeled 0 to n-1 and a list of undirected `edges`,
 * return the number of connected components in the graph.
 *
 * Example
 * -------
 * Input: n = 5, edges = [[0,1],[1,2],[3,4]]
 * Output: 2
 *
 * Constraints
 * -----------
 * 1 <= n <= 2000
 *
 * Approaches
 * ----------
 * 1. Brute force (`countComponentsBruteForce`) - Build an adjacency list, then
 *    start a DFS from every unvisited node, counting how many searches were
 *    needed. O(V + E) time, O(V + E) space.
 * 2. Better (`countComponentsBetter`) - Naive union-find: union every edge,
 *    then count distinct roots. O(E * V) worst-case time, O(V) space.
 * 3. Optimal (`countComponentsOptimal`) - Union-find with path compression +
 *    union by rank; start at n components and decrement on every successful
 *    union. O(E * α(V)) ≈ O(E) time, O(V) space.
 */
import assert from "node:assert/strict";

/**
 * Build an adjacency list, then start a DFS from every unvisited node,
 * counting how many searches were needed. O(V + E) time, O(V + E) space.
 */
export function countComponentsBruteForce(n: number, edges: number[][]): number {
  const graph: number[][] = Array.from({ length: n }, () => []);
  for (const [a, b] of edges) {
    graph[a].push(b);
    graph[b].push(a);
  }
  const visited: boolean[] = new Array(n).fill(false);
  let count = 0;
  for (let start = 0; start < n; start++) {
    if (visited[start]) continue;
    count++;
    const stack = [start];
    visited[start] = true;
    while (stack.length > 0) {
      for (const next of graph[stack.pop()!]) {
        if (!visited[next]) {
          visited[next] = true;
          stack.push(next);
        }
      }
    }
  }
  return count;
}

/** Naive union-find: union every edge, then count distinct roots. O(E * V) worst-case time, O(V) space. */
export function countComponentsBetter(n: number, edges: number[][]): number {
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x: number): number => {
    while (parent[x] !== x) x = parent[x];
    return x;
  };
  for (const [a, b] of edges) parent[find(a)] = find(b);
  const roots = new Set<number>();
  for (let i = 0; i < n; i++) roots.add(find(i));
  return roots.size;
}

/**
 * Union-find with path compression + union by rank; start at n components
 * and decrement on every successful union. O(E * α(V)) ≈ O(E) time, O(V) space.
 */
export function countComponentsOptimal(n: number, edges: number[][]): number {
  const parent = Array.from({ length: n }, (_, i) => i);
  const rank: number[] = new Array(n).fill(0);
  const find = (x: number): number => {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  };
  let components = n;
  for (const [a, b] of edges) {
    let ra = find(a);
    let rb = find(b);
    if (ra === rb) continue;
    if (rank[ra] < rank[rb]) [ra, rb] = [rb, ra];
    parent[rb] = ra;
    if (rank[ra] === rank[rb]) rank[ra]++;
    components--;
  }
  return components;
}

if (import.meta.main) {
  const tests: [number, number[][], number][] = [
    [5, [[0, 1], [1, 2], [3, 4]], 2],
    [5, [[0, 1], [1, 2], [2, 3], [3, 4]], 1],
    [4, [], 4],
    [1, [], 1],
    [4, [[0, 1], [1, 2], [2, 0]], 2],
  ];
  for (const [n, edges, expected] of tests) {
    for (const fn of [countComponentsBruteForce, countComponentsBetter, countComponentsOptimal]) {
      assert.equal(fn(n, edges), expected, `${fn.name}(${n}, ${JSON.stringify(edges)})`);
    }
  }
  console.log("All Number of Connected Components tests passed.");
}
