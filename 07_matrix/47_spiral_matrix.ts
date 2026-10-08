/**
 * 47. Spiral Matrix
 * LeetCode #54 | Difficulty: Medium | Category: Matrix
 *
 * Problem
 * -------
 * Given an m x n matrix, return all elements of the matrix in spiral
 * order (clockwise, starting from the top-left).
 *
 * Example
 * -------
 * Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]
 * Output: [1,2,3,6,9,8,7,4,5]
 *
 * Constraints
 * -----------
 * 1 <= m, n <= 10
 *
 * Approaches
 * ----------
 * 1. Brute force (`spiralOrderBruteForce`) - Simulate the walk with a boolean
 *    visited matrix, turning clockwise when the next cell is out of bounds or
 *    already visited. O(m*n) time, O(m*n) space.
 * 2. Better (`spiralOrderBetter`) - Same simulation, tracking visited cells in
 *    a Set of flat indices (r * n + c). O(m*n) time, O(m*n) space.
 * 3. Optimal (`spiralOrderOptimal`) - Peel layers using four shrinking
 *    boundaries; no visited tracking needed. O(m*n) time, O(1) extra space.
 */
import assert from "node:assert/strict";

const DIRECTIONS = [
  [0, 1], // right
  [1, 0], // down
  [0, -1], // left
  [-1, 0], // up
] as const;

/**
 * Simulate the walk with a boolean visited matrix, turning clockwise when
 * the next cell is out of bounds or already visited. O(m*n) time, O(m*n) space.
 */
export function spiralOrderBruteForce(matrix: number[][]): number[] {
  const m = matrix.length;
  const n = matrix[0].length;
  const visited: boolean[][] = Array.from({ length: m }, () => new Array(n).fill(false));
  const result: number[] = [];
  let r = 0;
  let c = 0;
  let d = 0;
  for (let step = 0; step < m * n; step++) {
    result.push(matrix[r][c]);
    visited[r][c] = true;
    let nr = r + DIRECTIONS[d][0];
    let nc = c + DIRECTIONS[d][1];
    if (nr < 0 || nr >= m || nc < 0 || nc >= n || visited[nr][nc]) {
      d = (d + 1) % 4;
      nr = r + DIRECTIONS[d][0];
      nc = c + DIRECTIONS[d][1];
    }
    [r, c] = [nr, nc];
  }
  return result;
}

/** Same simulation, tracking visited cells in a Set of flat indices (r * n + c). O(m*n) time, O(m*n) space. */
export function spiralOrderBetter(matrix: number[][]): number[] {
  const m = matrix.length;
  const n = matrix[0].length;
  const visited = new Set<number>();
  const result: number[] = [];
  let r = 0;
  let c = 0;
  let d = 0;
  while (result.length < m * n) {
    result.push(matrix[r][c]);
    visited.add(r * n + c);
    const nr = r + DIRECTIONS[d][0];
    const nc = c + DIRECTIONS[d][1];
    if (nr < 0 || nr >= m || nc < 0 || nc >= n || visited.has(nr * n + nc)) d = (d + 1) % 4;
    r += DIRECTIONS[d][0];
    c += DIRECTIONS[d][1];
  }
  return result;
}

/**
 * Peel layers using four shrinking boundaries; no visited tracking needed.
 * O(m*n) time, O(1) extra space.
 */
export function spiralOrderOptimal(matrix: number[][]): number[] {
  const result: number[] = [];
  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0].length - 1;
  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) result.push(matrix[top][c]);
    top++;
    for (let r = top; r <= bottom; r++) result.push(matrix[r][right]);
    right--;
    if (top <= bottom) {
      for (let c = right; c >= left; c--) result.push(matrix[bottom][c]);
      bottom--;
    }
    if (left <= right) {
      for (let r = bottom; r >= top; r--) result.push(matrix[r][left]);
      left++;
    }
  }
  return result;
}

if (import.meta.main) {
  const tests: [number[][], number[]][] = [
    [[[1, 2, 3], [4, 5, 6], [7, 8, 9]], [1, 2, 3, 6, 9, 8, 7, 4, 5]],
    [[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]], [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]],
    [[[1]], [1]],
    [[[1], [2], [3]], [1, 2, 3]],
  ];
  for (const [matrix, expected] of tests) {
    for (const fn of [spiralOrderBruteForce, spiralOrderBetter, spiralOrderOptimal]) {
      assert.deepEqual(fn(matrix.map((row) => [...row])), expected, `${fn.name}(${JSON.stringify(matrix)})`);
    }
  }
  console.log("All Spiral Matrix tests passed.");
}
