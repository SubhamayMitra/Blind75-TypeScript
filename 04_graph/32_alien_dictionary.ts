/**
 * 32. Alien Dictionary
 * LeetCode #269 (Premium) | Difficulty: Hard | Category: Graph
 *
 * Problem
 * -------
 * There is a new alien language that uses the English alphabet, but the
 * order among letters is unknown. You are given a list of `words` sorted
 * lexicographically by the rules of this new language. Derive a valid
 * ordering of letters, or return "" if no valid ordering exists (the
 * given order is invalid / contradictory), or if there could be multiple
 * valid orderings just return any one valid ordering.
 *
 * Example
 * -------
 * Input: words = ["wrt", "wrf", "er", "ett", "rw"]
 * Output: "wertf"
 *
 * Constraints
 * -----------
 * 1 <= words.length <= 100
 *
 * Approaches
 * ----------
 * 1. Brute force (`alienOrderBruteForce`) - Compare EVERY pair (i < j) of
 *    words, not just adjacent ones, to derive ordering edges, then
 *    topologically sort. Correct, but the non-adjacent comparisons are
 *    redundant. O(n^2 * L) time, O(1) extra space (26 letters).
 * 2. Better (`alienOrderBetter`) - Compare only adjacent words to build edges,
 *    then DFS topological sort with three-colour cycle detection (post-order,
 *    reversed). O(C) time where C = total characters, O(1) extra space.
 * 3. Optimal (`alienOrderOptimal`) - Compare only adjacent words to build
 *    edges + in-degrees, then Kahn's BFS topological sort; fewer letters
 *    processed than exist means a cycle. O(C) time, O(1) extra space.
 */
import assert from "node:assert/strict";

type Graph = Map<string, Set<string>>;

/** Every distinct letter in the words, each mapped to an empty edge set. */
function emptyGraph(words: string[]): Graph {
  const graph: Graph = new Map();
  for (const word of words) for (const ch of word) if (!graph.has(ch)) graph.set(ch, new Set());
  return graph;
}

/**
 * Add the ordering edge implied by word w1 coming before w2. Returns false
 * if the pair is invalid (w2 is a proper prefix of w1).
 */
function addEdge(graph: Graph, w1: string, w2: string): boolean {
  const len = Math.min(w1.length, w2.length);
  for (let i = 0; i < len; i++) {
    if (w1[i] !== w2[i]) {
      graph.get(w1[i])!.add(w2[i]);
      return true;
    }
  }
  return w1.length <= w2.length;
}

/** Kahn's topological sort; returns "" if a cycle prevents a full ordering. */
function kahn(graph: Graph): string {
  const inDegree = new Map<string, number>();
  for (const ch of graph.keys()) inDegree.set(ch, 0);
  for (const targets of graph.values()) for (const t of targets) inDegree.set(t, inDegree.get(t)! + 1);

  const queue = [...graph.keys()].filter((ch) => inDegree.get(ch) === 0);
  const order: string[] = [];
  for (let head = 0; head < queue.length; head++) {
    const ch = queue[head];
    order.push(ch);
    for (const next of graph.get(ch)!) {
      inDegree.set(next, inDegree.get(next)! - 1);
      if (inDegree.get(next) === 0) queue.push(next);
    }
  }
  return order.length === graph.size ? order.join("") : "";
}

/**
 * Compare EVERY pair (i < j) of words, not just adjacent ones, to derive
 * ordering edges, then topologically sort. Correct, but the non-adjacent
 * comparisons are redundant. O(n^2 * L) time, O(1) extra space (26 letters).
 */
export function alienOrderBruteForce(words: string[]): string {
  const graph = emptyGraph(words);
  for (let i = 0; i < words.length; i++) {
    for (let j = i + 1; j < words.length; j++) {
      if (!addEdge(graph, words[i], words[j])) return "";
    }
  }
  return kahn(graph);
}

/**
 * Compare only adjacent words to build edges, then DFS topological sort
 * with three-colour cycle detection (post-order, reversed).
 * O(C) time where C = total characters, O(1) extra space.
 */
export function alienOrderBetter(words: string[]): string {
  const graph = emptyGraph(words);
  for (let i = 0; i + 1 < words.length; i++) {
    if (!addEdge(graph, words[i], words[i + 1])) return "";
  }

  const state = new Map<string, 1 | 2>(); // 1 = on path, 2 = done
  const postOrder: string[] = [];
  const dfs = (ch: string): boolean => {
    const s = state.get(ch);
    if (s === 1) return false; // cycle
    if (s === 2) return true;
    state.set(ch, 1);
    for (const next of graph.get(ch)!) if (!dfs(next)) return false;
    state.set(ch, 2);
    postOrder.push(ch);
    return true;
  };
  for (const ch of graph.keys()) if (!dfs(ch)) return "";
  return postOrder.reverse().join("");
}

/**
 * Compare only adjacent words to build edges + in-degrees, then Kahn's BFS
 * topological sort; fewer letters processed than exist means a cycle.
 * O(C) time, O(1) extra space.
 */
export function alienOrderOptimal(words: string[]): string {
  const graph = emptyGraph(words);
  for (let i = 0; i + 1 < words.length; i++) {
    if (!addEdge(graph, words[i], words[i + 1])) return "";
  }
  return kahn(graph);
}

/** Check that `order` is consistent with the given sorted word list. */
function isValidOrder(order: string, words: string[]): boolean {
  const letters = new Set(words.join(""));
  if (order.length !== letters.size || [...letters].some((ch) => !order.includes(ch))) return false;
  const pos = new Map([...order].map((ch, i) => [ch, i]));
  for (let i = 0; i + 1 < words.length; i++) {
    const [w1, w2] = [words[i], words[i + 1]];
    const k = [...w1].findIndex((ch, j) => j >= w2.length || ch !== w2[j]);
    if (k === -1) continue; // w1 is a prefix of (or equal to) w2
    if (k >= w2.length) return false;
    if (pos.get(w1[k])! > pos.get(w2[k])!) return false;
  }
  return true;
}

if (import.meta.main) {
  const valid = [
    ["wrt", "wrf", "er", "ett", "rw"],
    ["z", "x"],
    ["ab", "abc"],
  ];
  const invalid = [
    ["abc", "ab"], // longer word with the same prefix comes first
    ["z", "x", "z"], // cycle z < x < z
  ];
  for (const fn of [alienOrderBruteForce, alienOrderBetter, alienOrderOptimal]) {
    for (const words of valid) {
      const result = fn([...words]);
      assert.ok(isValidOrder(result, words), `${fn.name}(${JSON.stringify(words)}) -> "${result}"`);
    }
    for (const words of invalid) {
      assert.equal(fn([...words]), "", `${fn.name}(${JSON.stringify(words)})`);
    }
  }
  console.log("All Alien Dictionary tests passed.");
}
