/**
 * 29. Pacific Atlantic Water Flow
 * LeetCode #417 | Difficulty: Medium | Category: Graph
 *
 * Problem
 * -------
 * Given an m x n grid of heights, the Pacific ocean touches the top and
 * left edges, the Atlantic touches the bottom and right edges. Water can
 * flow from a cell to a neighboring cell with height <= current height.
 * Return the list of coordinates where water can flow to BOTH oceans.
 *
 * Example
 * -------
 * Input: heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]
 * Output: [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]
 *
 * Constraints
 * -----------
 * 1 <= m, n <= 200
 *
 * Approaches
 * ----------
 * 1. Brute force (`pacificAtlanticBruteForce`) - From every cell, DFS along
 *    non-increasing heights and record whether a Pacific edge (top/left) and
 *    an Atlantic edge (bottom/right) are reached. O((m*n)^2) time, O(m*n)
 *    space.
 * 2. Better (`pacificAtlanticBetter`) - Same per-cell search, but stop as soon
 *    as both oceans have been reached instead of exhausting the whole downhill
 *    region. Prunes most searches in practice; worst case is still O((m*n)^2)
 *    time, O(m*n) space.
 * 3. Optimal (`pacificAtlanticOptimal`) - Reverse the flow: DFS uphill from
 *    every Pacific-border cell and, separately, from every Atlantic-border
 *    cell. Cells reached by both searches drain to both oceans. Each search
 *    visits each cell once. O(m*n) time, O(m*n) space.
 */
import assert from "node:assert/strict";

const DIRECTIONS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
] as const;

/**
 * From every cell, DFS along non-increasing heights and record whether a
 * Pacific edge (top/left) and an Atlantic edge (bottom/right) are reached.
 * O((m*n)^2) time, O(m*n) space.
 */
export function pacificAtlanticBruteForce(heights: number[][]): number[][] {
  const m = heights.length;
  const n = heights[0].length;
  const result: number[][] = [];
  for (let r0 = 0; r0 < m; r0++) {
    for (let c0 = 0; c0 < n; c0++) {
      const visited = new Set<number>([r0 * n + c0]);
      const stack: [number, number][] = [[r0, c0]];
      let pacific = false;
      let atlantic = false;
      while (stack.length > 0) {
        const [r, c] = stack.pop()!;
        if (r === 0 || c === 0) pacific = true;
        if (r === m - 1 || c === n - 1) atlantic = true;
        for (const [dr, dc] of DIRECTIONS) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
          if (visited.has(nr * n + nc) || heights[nr][nc] > heights[r][c]) continue;
          visited.add(nr * n + nc);
          stack.push([nr, nc]);
        }
      }
      if (pacific && atlantic) result.push([r0, c0]);
    }
  }
  return result;
}

/**
 * Same per-cell search, but stop as soon as both oceans have been reached
 * instead of exhausting the whole downhill region. Prunes most searches
 * in practice; worst case is still O((m*n)^2) time, O(m*n) space.
 */
export function pacificAtlanticBetter(heights: number[][]): number[][] {
  const m = heights.length;
  const n = heights[0].length;
  const reachesBoth = (r0: number, c0: number): boolean => {
    const visited = new Set<number>([r0 * n + c0]);
    const stack: [number, number][] = [[r0, c0]];
    let pacific = false;
    let atlantic = false;
    while (stack.length > 0) {
      const [r, c] = stack.pop()!;
      if (r === 0 || c === 0) pacific = true;
      if (r === m - 1 || c === n - 1) atlantic = true;
      if (pacific && atlantic) return true;
      for (const [dr, dc] of DIRECTIONS) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
        if (visited.has(nr * n + nc) || heights[nr][nc] > heights[r][c]) continue;
        visited.add(nr * n + nc);
        stack.push([nr, nc]);
      }
    }
    return false;
  };

  const result: number[][] = [];
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) if (reachesBoth(r, c)) result.push([r, c]);
  }
  return result;
}

/**
 * Reverse the flow: DFS uphill from every Pacific-border cell and, separately,
 * from every Atlantic-border cell. Cells reached by both searches drain to
 * both oceans. Each search visits each cell once. O(m*n) time, O(m*n) space.
 */
export function pacificAtlanticOptimal(heights: number[][]): number[][] {
  const m = heights.length;
  const n = heights[0].length;
  const pacific: boolean[][] = Array.from({ length: m }, () => new Array(n).fill(false));
  const atlantic: boolean[][] = Array.from({ length: m }, () => new Array(n).fill(false));

  const dfs = (r: number, c: number, reached: boolean[][]): void => {
    reached[r][c] = true;
    for (const [dr, dc] of DIRECTIONS) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
      if (reached[nr][nc] || heights[nr][nc] < heights[r][c]) continue;
      dfs(nr, nc, reached);
    }
  };

  for (let r = 0; r < m; r++) {
    dfs(r, 0, pacific);
    dfs(r, n - 1, atlantic);
  }
  for (let c = 0; c < n; c++) {
    dfs(0, c, pacific);
    dfs(m - 1, c, atlantic);
  }

  const result: number[][] = [];
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) if (pacific[r][c] && atlantic[r][c]) result.push([r, c]);
  }
  return result;
}

function normalize(cells: number[][]): string[] {
  return cells.map(([r, c]) => `${r},${c}`).sort();
}

if (import.meta.main) {
  const tests: [number[][], number[][]][] = [
    [
      [
        [1, 2, 2, 3, 5],
        [3, 2, 3, 4, 4],
        [2, 4, 5, 3, 1],
        [6, 7, 1, 4, 5],
        [5, 1, 1, 2, 4],
      ],
      [[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]],
    ],
    [[[1]], [[0, 0]]],
  ];
  for (const [heights, expected] of tests) {
    for (const fn of [pacificAtlanticBruteForce, pacificAtlanticBetter, pacificAtlanticOptimal]) {
      const result = fn(heights.map((row) => [...row]));
      assert.deepEqual(normalize(result), normalize(expected), fn.name);
    }
  }
  console.log("All Pacific Atlantic Water Flow tests passed.");
}
