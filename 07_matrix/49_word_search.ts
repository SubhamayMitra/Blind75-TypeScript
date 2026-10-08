/**
 * 49. Word Search
 * LeetCode #79 | Difficulty: Medium | Category: Matrix / Backtracking
 *
 * Problem
 * -------
 * Given an m x n grid of characters `board` and a string `word`, return
 * true if `word` exists in the grid. The word can be constructed from
 * letters of sequentially adjacent cells (horizontally or vertically),
 * where the same cell may not be used more than once.
 *
 * Example
 * -------
 * Input: board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]],
 *        word = "ABCCED"
 * Output: true
 *
 * Constraints
 * -----------
 * 1 <= m, n <= 6, 1 <= word.length <= 15
 *
 * Approaches
 * ----------
 * 1. Brute force (`existBruteForce`) - Backtracking DFS from every cell,
 *    allocating a fresh boolean visited matrix for each starting cell.
 *    O(m*n*4^L) time, O(m*n) space per start.
 * 2. Better (`existBetter`) - Backtracking DFS with one shared visited Set
 *    reused across all starting cells (backtracking leaves it empty after each
 *    search). O(m*n*4^L) time, O(L) space.
 * 3. Optimal (`existOptimal`) - Backtracking DFS that marks a cell visited by
 *    temporarily overwriting it with '#' and restores it on the way back. Also
 *    prunes up front if the board lacks enough of any letter. O(m*n*4^L) time,
 *    O(L) recursion space.
 */
import assert from "node:assert/strict";

/**
 * Backtracking DFS from every cell, allocating a fresh boolean visited
 * matrix for each starting cell. O(m*n*4^L) time, O(m*n) space per start.
 */
export function existBruteForce(board: string[][], word: string): boolean {
  const m = board.length;
  const n = board[0].length;
  for (let r0 = 0; r0 < m; r0++) {
    for (let c0 = 0; c0 < n; c0++) {
      const visited: boolean[][] = Array.from({ length: m }, () => new Array(n).fill(false));
      const dfs = (r: number, c: number, i: number): boolean => {
        if (i === word.length) return true;
        if (r < 0 || r >= m || c < 0 || c >= n || visited[r][c] || board[r][c] !== word[i]) return false;
        visited[r][c] = true;
        const found = dfs(r + 1, c, i + 1) || dfs(r - 1, c, i + 1) || dfs(r, c + 1, i + 1) || dfs(r, c - 1, i + 1);
        visited[r][c] = false;
        return found;
      };
      if (dfs(r0, c0, 0)) return true;
    }
  }
  return false;
}

/**
 * Backtracking DFS with one shared visited Set reused across all starting
 * cells (backtracking leaves it empty after each search).
 * O(m*n*4^L) time, O(L) space.
 */
export function existBetter(board: string[][], word: string): boolean {
  const m = board.length;
  const n = board[0].length;
  const visited = new Set<number>();
  const dfs = (r: number, c: number, i: number): boolean => {
    if (i === word.length) return true;
    if (r < 0 || r >= m || c < 0 || c >= n || visited.has(r * n + c) || board[r][c] !== word[i]) return false;
    visited.add(r * n + c);
    const found = dfs(r + 1, c, i + 1) || dfs(r - 1, c, i + 1) || dfs(r, c + 1, i + 1) || dfs(r, c - 1, i + 1);
    visited.delete(r * n + c);
    return found;
  };
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) if (dfs(r, c, 0)) return true;
  }
  return false;
}

/**
 * Backtracking DFS that marks a cell visited by temporarily overwriting it
 * with '#' and restores it on the way back. Also prunes up front if the
 * board lacks enough of any letter. O(m*n*4^L) time, O(L) recursion space.
 */
export function existOptimal(board: string[][], word: string): boolean {
  const m = board.length;
  const n = board[0].length;

  const available = new Map<string, number>();
  for (const row of board) for (const ch of row) available.set(ch, (available.get(ch) ?? 0) + 1);
  const needed = new Map<string, number>();
  for (const ch of word) needed.set(ch, (needed.get(ch) ?? 0) + 1);
  for (const [ch, count] of needed) if ((available.get(ch) ?? 0) < count) return false;

  const dfs = (r: number, c: number, i: number): boolean => {
    if (i === word.length) return true;
    if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] !== word[i]) return false;
    const saved = board[r][c];
    board[r][c] = "#";
    const found = dfs(r + 1, c, i + 1) || dfs(r - 1, c, i + 1) || dfs(r, c + 1, i + 1) || dfs(r, c - 1, i + 1);
    board[r][c] = saved;
    return found;
  };
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) if (dfs(r, c, 0)) return true;
  }
  return false;
}

if (import.meta.main) {
  const board = ["ABCE", "SFCS", "ADEE"];
  const tests: [string, boolean][] = [
    ["ABCCED", true],
    ["SEE", true],
    ["ABCB", false],
    ["ABCESEEDAS", true],
    ["Z", false],
  ];
  for (const [word, expected] of tests) {
    for (const fn of [existBruteForce, existBetter, existOptimal]) {
      const grid = board.map((row) => [...row]);
      assert.equal(fn(grid, word), expected, `${fn.name}(${word})`);
      assert.deepEqual(grid.map((row) => row.join("")), board, `${fn.name} must restore the board`);
    }
  }
  console.log("All Word Search tests passed.");
}
