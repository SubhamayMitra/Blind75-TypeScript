/**
 * 71. Implement Trie (Prefix Tree)
 * LeetCode #208 | Difficulty: Medium | Category: Tree / Trie
 *
 * Problem
 * -------
 * Implement a trie with `insert`, `search`, and `startsWith` methods.
 * - insert(word): inserts the string word into the trie.
 * - search(word): returns true if word is in the trie (exact match).
 * - startsWith(prefix): returns true if any previously inserted word has
 *   `prefix` as a prefix.
 *
 * Example
 * -------
 * Input: insert("apple"); search("apple") -> true; search("app") -> false;
 *        startsWith("app") -> true; insert("app"); search("app") -> true
 *
 * Constraints
 * -----------
 * 1 <= word.length, prefix.length <= 2000, lowercase English letters only.
 *
 * Approaches
 * ----------
 * 1. Brute force (`TrieBruteForce`) - A flat Set of words. search is an O(L)
 *    hash lookup, but startsWith must scan every stored word. insert O(L),
 *    search O(L), startsWith O(N*L).
 * 2. Better (`TrieBetter`) - A sorted array of words. Binary search finds the
 *    first word >= the query; for startsWith, that word has the prefix iff any
 *    word does. insert O(N) (array shift), search O(L log N), startsWith O(L
 *    log N).
 * 3. Optimal (`TrieOptimal`) - Classic prefix tree: each node maps a character
 *    to a child and flags the end of a word; every operation walks exactly L
 *    nodes. insert, search, startsWith: O(L) each, independent of N.
 */
import assert from "node:assert/strict";

interface PrefixStore {
  insert(word: string): void;
  search(word: string): boolean;
  startsWith(prefix: string): boolean;
}

/**
 * A flat Set of words. search is an O(L) hash lookup, but startsWith must
 * scan every stored word. insert O(L), search O(L), startsWith O(N*L).
 */
export class TrieBruteForce implements PrefixStore {
  private readonly words = new Set<string>();

  insert(word: string): void {
    this.words.add(word);
  }

  search(word: string): boolean {
    return this.words.has(word);
  }

  startsWith(prefix: string): boolean {
    for (const word of this.words) if (word.startsWith(prefix)) return true;
    return false;
  }
}

/**
 * A sorted array of words. Binary search finds the first word >= the
 * query; for startsWith, that word has the prefix iff any word does.
 * insert O(N) (array shift), search O(L log N), startsWith O(L log N).
 */
export class TrieBetter implements PrefixStore {
  private readonly words: string[] = [];

  private lowerBound(target: string): number {
    let lo = 0;
    let hi = this.words.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (this.words[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }

  insert(word: string): void {
    const i = this.lowerBound(word);
    if (this.words[i] !== word) this.words.splice(i, 0, word);
  }

  search(word: string): boolean {
    return this.words[this.lowerBound(word)] === word;
  }

  startsWith(prefix: string): boolean {
    const candidate = this.words[this.lowerBound(prefix)];
    return candidate !== undefined && candidate.startsWith(prefix);
  }
}

class TrieNode {
  readonly children = new Map<string, TrieNode>();
  isEnd = false;
}

/**
 * Classic prefix tree: each node maps a character to a child and flags the
 * end of a word; every operation walks exactly L nodes.
 * insert, search, startsWith: O(L) each, independent of N.
 */
export class TrieOptimal implements PrefixStore {
  private readonly root = new TrieNode();

  insert(word: string): void {
    let node = this.root;
    for (const ch of word) {
      let child = node.children.get(ch);
      if (!child) {
        child = new TrieNode();
        node.children.set(ch, child);
      }
      node = child;
    }
    node.isEnd = true;
  }

  search(word: string): boolean {
    return this.walk(word)?.isEnd ?? false;
  }

  startsWith(prefix: string): boolean {
    return this.walk(prefix) !== null;
  }

  private walk(str: string): TrieNode | null {
    let node: TrieNode | undefined = this.root;
    for (const ch of str) {
      node = node.children.get(ch);
      if (!node) return null;
    }
    return node;
  }
}

if (import.meta.main) {
  for (const TrieClass of [TrieBruteForce, TrieBetter, TrieOptimal]) {
    const trie = new TrieClass();
    const name = TrieClass.name;
    trie.insert("apple");
    assert.equal(trie.search("apple"), true, name);
    assert.equal(trie.search("app"), false, name);
    assert.equal(trie.startsWith("app"), true, name);
    trie.insert("app");
    assert.equal(trie.search("app"), true, name);
    assert.equal(trie.startsWith("appl"), true, name);
    assert.equal(trie.startsWith("b"), false, name);
    trie.insert("banana");
    assert.equal(trie.startsWith("ban"), true, name);
    assert.equal(trie.startsWith("apples"), false, name);
  }
  console.log("All Implement Trie tests passed.");
}
