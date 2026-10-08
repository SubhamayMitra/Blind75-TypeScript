/**
 * 48. Rotate Image
 * LeetCode #48 | Difficulty: Medium | Category: Matrix
 *
 * Problem
 * -------
 * Given an n x n 2D `matrix` representing an image, rotate the image by
 * 90 degrees clockwise, in place.
 *
 * Example
 * -------
 * Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]
 * Output: [[7,4,1],[8,5,2],[9,6,3]]
 *
 * Constraints
 * -----------
 * 1 <= n <= 20
 *
 * Approaches
 * ----------
 * 1. Brute force (`rotateBruteForce`) - Build a rotated copy with
 *    rotated[c][n-1-r] = matrix[r][c], then copy it back into the caller's
 *    matrix. O(n^2) time, O(n^2) space.
 * 2. Better (`rotateBetter`) - Rotate layer by layer (outside in), cycling
 *    each group of four cells: left -> top -> right -> bottom -> left. O(n^2)
 *    time, O(1) extra space.
 * 3. Optimal (`rotateOptimal`) - Transpose in place, then reverse each row.
 *    O(n^2) time, O(1) extra space.
 */
import assert from "node:assert/strict";

/**
 * Build a rotated copy with rotated[c][n-1-r] = matrix[r][c], then copy it
 * back into the caller's matrix. O(n^2) time, O(n^2) space.
 */
export function rotateBruteForce(matrix: number[][]): void {
  const n = matrix.length;
  const rotated: number[][] = Array.from({ length: n }, () => new Array(n));
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) rotated[c][n - 1 - r] = matrix[r][c];
  }
  for (let r = 0; r < n; r++) matrix[r] = rotated[r];
}

/**
 * Rotate layer by layer (outside in), cycling each group of four cells:
 * left -> top -> right -> bottom -> left. O(n^2) time, O(1) extra space.
 */
export function rotateBetter(matrix: number[][]): void {
  const n = matrix.length;
  for (let layer = 0; layer < n >> 1; layer++) {
    const first = layer;
    const last = n - 1 - layer;
    for (let i = first; i < last; i++) {
      const offset = i - first;
      const top = matrix[first][i];
      matrix[first][i] = matrix[last - offset][first]; // left -> top
      matrix[last - offset][first] = matrix[last][last - offset]; // bottom -> left
      matrix[last][last - offset] = matrix[i][last]; // right -> bottom
      matrix[i][last] = top; // top -> right
    }
  }
}

/** Transpose in place, then reverse each row. O(n^2) time, O(1) extra space. */
export function rotateOptimal(matrix: number[][]): void {
  const n = matrix.length;
  for (let r = 0; r < n; r++) {
    for (let c = r + 1; c < n; c++) [matrix[r][c], matrix[c][r]] = [matrix[c][r], matrix[r][c]];
  }
  for (const row of matrix) row.reverse();
}

if (import.meta.main) {
  const tests: [number[][], number[][]][] = [
    [[[1, 2, 3], [4, 5, 6], [7, 8, 9]], [[7, 4, 1], [8, 5, 2], [9, 6, 3]]],
    [
      [[5, 1, 9, 11], [2, 4, 8, 10], [13, 3, 6, 7], [15, 14, 12, 16]],
      [[15, 13, 2, 5], [14, 3, 4, 1], [12, 6, 8, 9], [16, 7, 10, 11]],
    ],
    [[[1]], [[1]]],
  ];
  for (const [matrix, expected] of tests) {
    for (const fn of [rotateBruteForce, rotateBetter, rotateOptimal]) {
      const m = matrix.map((row) => [...row]);
      fn(m);
      assert.deepEqual(m, expected, `${fn.name}(${JSON.stringify(matrix)})`);
    }
  }
  console.log("All Rotate Image tests passed.");
}
