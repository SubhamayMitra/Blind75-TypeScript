/**
 * 73. Word Search II
 * LeetCode #212 | Difficulty: Hard | Category: Tree / Trie / Backtracking
 *
 * Problem
 * -------
 * Given an m x n `board` of characters and a list of strings `words`,
 * return all words from `words` that can be constructed from letters of
 * sequentially adjacent cells (horizontally or vertically), where the
 * same cell may not be used more than once per word.
 *
 * Example
 * -------
 * Input: board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]],
 *        words = ["oath","pea","eat","rain"]
 * Output: ["eat","oath"]
 *
 * Constraints
 * -----------
 * 1 <= m, n <= 12, 1 <= words.length <= 3*10^4
 *
 * Approaches
 * ----------
 * 1. Brute force (`findWordsBruteForce`) - Run the Word Search I backtracking
 *    DFS independently for every word. Words sharing prefixes repeat the same
 *    board exploration. O(W * m*n * 4^L) time, O(L) space.
 * 2. Better (`findWordsBetter`) - Build a trie of all words, then one
 *    backtracking DFS per starting cell that follows trie edges, so shared
 *    prefixes are explored once. Found words are collected in a Set (the trie
 *    is not pruned). O(m*n * 4^L) time, O(total word length) space.
 * 3. Optimal (`findWordsOptimal`) - Same trie + DFS, but prune as we go: clear
 *    a word once found (no duplicates, no Set needed) and delete trie leaves
 *    that become empty, so later searches skip exhausted branches. O(m*n *
 *    4^L) worst case, much faster in practice; O(total word length) space.
 */
import assert from "node:assert/strict";

/**
 * Run the Word Search I backtracking DFS independently for every word.
 * Words sharing prefixes repeat the same board exploration.
 * O(W * m*n * 4^L) time, O(L) space.
 */
export function findWordsBruteForce(board: string[][], words: string[]): string[] {
  const m = board.length;
  const n = board[0].length;
  const exists = (word: string): boolean => {
    const dfs = (r: number, c: number, i: number): boolean => {
      if (i === word.length) return true;
      if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] !== word[i]) return false;
      board[r][c] = "#";
      const found = dfs(r + 1, c, i + 1) || dfs(r - 1, c, i + 1) || dfs(r, c + 1, i + 1) || dfs(r, c - 1, i + 1);
      board[r][c] = word[i];
      return found;
    };
    for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) if (dfs(r, c, 0)) return true;
    return false;
  };
  return [...new Set(words)].filter(exists);
}

class TrieNode {
  readonly children = new Map<string, TrieNode>();
  word: string | null = null; // set on the node that ends a word
}

function buildTrie(words: string[]): TrieNode {
  const root = new TrieNode();
  for (const word of words) {
    let node = root;
    for (const ch of word) {
      let child = node.children.get(ch);
      if (!child) {
        child = new TrieNode();
        node.children.set(ch, child);
      }
      node = child;
    }
    node.word = word;
  }
  return root;
}

/**
 * Build a trie of all words, then one backtracking DFS per starting cell
 * that follows trie edges, so shared prefixes are explored once. Found
 * words are collected in a Set (the trie is not pruned).
 * O(m*n * 4^L) time, O(total word length) space.
 */
export function findWordsBetter(board: string[][], words: string[]): string[] {
  const m = board.length;
  const n = board[0].length;
  const root = buildTrie(words);
  const found = new Set<string>();

  const dfs = (r: number, c: number, parent: TrieNode): void => {
    if (r < 0 || r >= m || c < 0 || c >= n) return;
    const ch = board[r][c];
    const node = parent.children.get(ch);
    if (!node) return;
    if (node.word) found.add(node.word);
    board[r][c] = "#";
    dfs(r + 1, c, node);
    dfs(r - 1, c, node);
    dfs(r, c + 1, node);
    dfs(r, c - 1, node);
    board[r][c] = ch;
  };

  for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) dfs(r, c, root);
  return [...found];
}

/**
 * Same trie + DFS, but prune as we go: clear a word once found (no
 * duplicates, no Set needed) and delete trie leaves that become empty, so
 * later searches skip exhausted branches.
 * O(m*n * 4^L) worst case, much faster in practice; O(total word length) space.
 */
export function findWordsOptimal(board: string[][], words: string[]): string[] {
  const m = board.length;
  const n = board[0].length;
  const root = buildTrie(words);
  const found: string[] = [];

  const dfs = (r: number, c: number, parent: TrieNode): void => {
    const ch = board[r][c];
    const node = parent.children.get(ch);
    if (!node) return;
    if (node.word) {
      found.push(node.word);
      node.word = null;
    }
    board[r][c] = "#";
    if (r > 0) dfs(r - 1, c, node);
    if (r < m - 1) dfs(r + 1, c, node);
    if (c > 0) dfs(r, c - 1, node);
    if (c < n - 1) dfs(r, c + 1, node);
    board[r][c] = ch;
    if (node.children.size === 0 && !node.word) parent.children.delete(ch);
  };

  for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) dfs(r, c, root);
  return found;
}

if (import.meta.main) {
  const tests: [string[], string[], string[]][] = [
    [["oaan", "etae", "ihkr", "iflv"], ["oath", "pea", "eat", "rain"], ["eat", "oath"]],
    [["ab", "cd"], ["abcb"], []],
    [["a"], ["a", "a"], ["a"]],
    [["ab", "cd"], ["ab", "abd", "abdc", "ac", "x"], ["ab", "abd", "abdc", "ac"]],
  ];
  for (const [rows, words, expected] of tests) {
    for (const fn of [findWordsBruteForce, findWordsBetter, findWordsOptimal]) {
      const board = rows.map((row) => [...row]);
      assert.deepEqual(fn(board, [...words]).sort(), expected, `${fn.name}(${JSON.stringify(words)})`);
      assert.deepEqual(board.map((row) => row.join("")), rows, `${fn.name} must restore the board`);
    }
  }
  console.log("All Word Search II tests passed.");
}
