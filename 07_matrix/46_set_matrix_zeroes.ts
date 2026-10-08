/**
 * 46. Set Matrix Zeroes
 * LeetCode #73 | Difficulty: Medium | Category: Matrix
 *
 * Problem
 * -------
 * Given an m x n integer matrix, if an element is 0, set its entire row
 * and column to 0. Do it in place.
 *
 * Example
 * -------
 * Input: matrix = [[1,1,1],[1,0,1],[1,1,1]]
 * Output: [[1,0,1],[0,0,0],[1,0,1]]
 *
 * Constraints
 * -----------
 * 1 <= m, n <= 200
 *
 * Approaches
 * ----------
 * 1. Brute force (`setZeroesBruteForce`) - Scan a copy of the original for
 *    zeros and, for each one, zero out its row and column in the real matrix
 *    (the copy prevents cascading). O(m*n*(m+n)) time, O(m*n) space.
 * 2. Better (`setZeroesBetter`) - Record zero rows and columns in two Sets,
 *    then zero them in a second pass. O(m*n) time, O(m+n) space.
 * 3. Optimal (`setZeroesOptimal`) - Use the first row and first column as the
 *    marker arrays. matrix[0][0] marks row 0, and a separate flag remembers
 *    whether column 0 itself must be zeroed. Fill from the bottom-right so
 *    markers are read before being overwritten. O(m*n) time, O(1) extra space.
 */
import assert from "node:assert/strict";

/**
 * Scan a copy of the original for zeros and, for each one, zero out its
 * row and column in the real matrix (the copy prevents cascading).
 * O(m*n*(m+n)) time, O(m*n) space.
 */
export function setZeroesBruteForce(matrix: number[][]): void {
  const m = matrix.length;
  const n = matrix[0].length;
  const original = matrix.map((row) => [...row]);
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (original[r][c] !== 0) continue;
      for (let k = 0; k < n; k++) matrix[r][k] = 0;
      for (let k = 0; k < m; k++) matrix[k][c] = 0;
    }
  }
}

/** Record zero rows and columns in two Sets, then zero them in a second pass. O(m*n) time, O(m+n) space. */
export function setZeroesBetter(matrix: number[][]): void {
  const rows = new Set<number>();
  const cols = new Set<number>();
  matrix.forEach((row, r) =>
    row.forEach((value, c) => {
      if (value === 0) {
        rows.add(r);
        cols.add(c);
      }
    }),
  );
  matrix.forEach((row, r) =>
    row.forEach((_, c) => {
      if (rows.has(r) || cols.has(c)) row[c] = 0;
    }),
  );
}

/**
 * Use the first row and first column as the marker arrays. matrix[0][0]
 * marks row 0, and a separate flag remembers whether column 0 itself must
 * be zeroed. Fill from the bottom-right so markers are read before being
 * overwritten. O(m*n) time, O(1) extra space.
 */
export function setZeroesOptimal(matrix: number[][]): void {
  const m = matrix.length;
  const n = matrix[0].length;
  let firstColZero = false;
  for (let r = 0; r < m; r++) {
    if (matrix[r][0] === 0) firstColZero = true;
    for (let c = 1; c < n; c++) {
      if (matrix[r][c] === 0) {
        matrix[r][0] = 0;
        matrix[0][c] = 0;
      }
    }
  }
  for (let r = m - 1; r >= 0; r--) {
    for (let c = n - 1; c >= 1; c--) {
      if (matrix[r][0] === 0 || matrix[0][c] === 0) matrix[r][c] = 0;
    }
    if (firstColZero) matrix[r][0] = 0;
  }
}

if (import.meta.main) {
  const tests: [number[][], number[][]][] = [
    [[[1, 1, 1], [1, 0, 1], [1, 1, 1]], [[1, 0, 1], [0, 0, 0], [1, 0, 1]]],
    [[[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]], [[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]]],
    [[[1]], [[1]]],
    [[[1, 0]], [[0, 0]]],
  ];
  for (const [matrix, expected] of tests) {
    for (const fn of [setZeroesBruteForce, setZeroesBetter, setZeroesOptimal]) {
      const m = matrix.map((row) => [...row]);
      fn(m);
      assert.deepEqual(m, expected, `${fn.name}(${JSON.stringify(matrix)})`);
    }
  }
  console.log("All Set Matrix Zeroes tests passed.");
}
