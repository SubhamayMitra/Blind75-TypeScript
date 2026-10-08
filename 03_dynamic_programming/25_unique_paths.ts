/**
 * 25. Unique Paths
 * LeetCode #62 | Difficulty: Medium | Category: Dynamic Programming
 *
 * Problem
 * -------
 * A robot is located at the top-left corner of an m x n grid. It can only
 * move either down or right at any point. How many possible unique paths
 * are there to reach the bottom-right corner?
 *
 * Example
 * -------
 * Input: m = 3, n = 7
 * Output: 28
 *
 * Constraints
 * -----------
 * 1 <= m, n <= 100
 *
 * Approaches
 * ----------
 * 1. Brute force (`uniquePathsBruteForce`) - Recursively explore every
 *    down/right move. O(2^(m+n)) time, O(m+n) space.
 * 2. Better (`uniquePathsBetter`) - Top-down recursion + memoization on (r,
 *    c). O(m*n) time, O(m*n) space.
 * 3. Optimal (`uniquePathsOptimal`) - Bottom-up DP with one rolling row sized
 *    to the smaller dimension: row[c] += row[c - 1] adds "from above" (old
 *    value) and "from the left". O(m*n) time, O(min(m, n)) space.
 * 4. Bonus (`uniquePathsCombinatorics`) - Closed form. Any path is (m -
 *    1) downs and (n - 1) rights in some order, so the answer is C(m + n - 2,
 *    min(m, n) - 1). O(min(m, n)) time.
 */
import assert from "node:assert/strict";

/** Recursively explore every down/right move. O(2^(m+n)) time, O(m+n) space. */
export function uniquePathsBruteForce(m: number, n: number): number {
  const solve = (r: number, c: number): number => {
    if (r === m - 1 || c === n - 1) return 1;
    return solve(r + 1, c) + solve(r, c + 1);
  };
  return solve(0, 0);
}

/** Top-down recursion + memoization on (r, c). O(m*n) time, O(m*n) space. */
export function uniquePathsBetter(m: number, n: number): number {
  const memo: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));
  const solve = (r: number, c: number): number => {
    if (r === m - 1 || c === n - 1) return 1;
    if (memo[r][c] === 0) memo[r][c] = solve(r + 1, c) + solve(r, c + 1);
    return memo[r][c];
  };
  return solve(0, 0);
}

/**
 * Bottom-up DP with one rolling row sized to the smaller dimension:
 * row[c] += row[c - 1] adds "from above" (old value) and "from the left".
 * O(m*n) time, O(min(m, n)) space.
 */
export function uniquePathsOptimal(m: number, n: number): number {
  const [rows, cols] = m >= n ? [m, n] : [n, m];
  const row: number[] = new Array(cols).fill(1);
  for (let r = 1; r < rows; r++) {
    for (let c = 1; c < cols; c++) row[c] += row[c - 1];
  }
  return row[cols - 1];
}

/**
 * Bonus: closed form. Any path is (m - 1) downs and (n - 1) rights in some
 * order, so the answer is C(m + n - 2, min(m, n) - 1). O(min(m, n)) time.
 */
export function uniquePathsCombinatorics(m: number, n: number): number {
  const k = Math.min(m, n) - 1;
  const total = m + n - 2;
  let result = 1;
  // multiply then divide stays an exact integer at every step
  for (let i = 1; i <= k; i++) result = (result * (total - k + i)) / i;
  return result;
}

if (import.meta.main) {
  const tests: [number, number, number][] = [
    [3, 7, 28],
    [3, 2, 3],
    [1, 1, 1],
    [7, 3, 28],
  ];
  for (const [m, n, expected] of tests) {
    for (const fn of [uniquePathsBruteForce, uniquePathsBetter, uniquePathsOptimal, uniquePathsCombinatorics]) {
      assert.equal(fn(m, n), expected, `${fn.name}(${m}, ${n})`);
    }
  }
  console.log("All Unique Paths tests passed.");
}
