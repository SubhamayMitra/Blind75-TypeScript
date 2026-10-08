/**
 * 30. Number of Islands
 * LeetCode #200 | Difficulty: Medium | Category: Graph
 *
 * Problem
 * -------
 * Given an m x n 2D binary grid `grid` which represents a map of '1's
 * (land) and '0's (water), return the number of islands. An island is
 * surrounded by water and formed by connecting adjacent lands
 * horizontally or vertically.
 *
 * Example
 * -------
 * Input: grid = [
 *   ["1","1","0","0","0"],
 *   ["1","1","0","0","0"],
 *   ["0","0","1","0","0"],
 *   ["0","0","0","1","1"]]
 * Output: 3
 *
 * Constraints
 * -----------
 * 1 <= m, n <= 300
 *
 * Approaches
 * ----------
 * 1. Brute force (`numIslandsBruteForce`) - Recursive DFS that leaves the grid
 *    untouched and tracks visited cells in a separate Set of "r,c" keys.
 *    O(m*n) time, O(m*n) extra space.
 * 2. Better (`numIslandsBetter`) - BFS flood fill, sinking visited land in
 *    place ('1' -> '0'). O(m*n) time, O(min(m, n)) queue space.
 * 3. Optimal (`numIslandsOptimal`) - Recursive DFS flood fill, sinking visited
 *    land in place. O(m*n) time, O(m*n) worst-case recursion depth.
 */
import assert from "node:assert/strict";

/**
 * Recursive DFS that leaves the grid untouched and tracks visited cells in
 * a separate Set of "r,c" keys. O(m*n) time, O(m*n) extra space.
 */
export function numIslandsBruteForce(grid: string[][]): number {
  const m = grid.length;
  const n = grid[0].length;
  const visited = new Set<string>();
  const dfs = (r: number, c: number): void => {
    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== "1") return;
    const key = `${r},${c}`;
    if (visited.has(key)) return;
    visited.add(key);
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  };

  let count = 0;
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] === "1" && !visited.has(`${r},${c}`)) {
        count++;
        dfs(r, c);
      }
    }
  }
  return count;
}

/** BFS flood fill, sinking visited land in place ('1' -> '0'). O(m*n) time, O(min(m, n)) queue space. */
export function numIslandsBetter(grid: string[][]): number {
  const m = grid.length;
  const n = grid[0].length;
  let count = 0;
  for (let r0 = 0; r0 < m; r0++) {
    for (let c0 = 0; c0 < n; c0++) {
      if (grid[r0][c0] !== "1") continue;
      count++;
      grid[r0][c0] = "0";
      const queue: [number, number][] = [[r0, c0]];
      for (let head = 0; head < queue.length; head++) {
        const [r, c] = queue[head];
        for (const [nr, nc] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]]) {
          if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] === "1") {
            grid[nr][nc] = "0";
            queue.push([nr, nc]);
          }
        }
      }
    }
  }
  return count;
}

/** Recursive DFS flood fill, sinking visited land in place. O(m*n) time, O(m*n) worst-case recursion depth. */
export function numIslandsOptimal(grid: string[][]): number {
  const m = grid.length;
  const n = grid[0].length;
  const sink = (r: number, c: number): void => {
    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== "1") return;
    grid[r][c] = "0";
    sink(r + 1, c);
    sink(r - 1, c);
    sink(r, c + 1);
    sink(r, c - 1);
  };

  let count = 0;
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] === "1") {
        count++;
        sink(r, c);
      }
    }
  }
  return count;
}

if (import.meta.main) {
  const tests: [string[], number][] = [
    [["11000", "11000", "00100", "00011"], 3],
    [["111", "010", "111"], 1],
    [["11110", "11010", "11000", "00000"], 1],
    [["0"], 0],
  ];
  for (const [rows, expected] of tests) {
    for (const fn of [numIslandsBruteForce, numIslandsBetter, numIslandsOptimal]) {
      const grid = rows.map((row) => [...row]);
      assert.equal(fn(grid), expected, `${fn.name}(${JSON.stringify(rows)})`);
    }
  }
  console.log("All Number of Islands tests passed.");
}
