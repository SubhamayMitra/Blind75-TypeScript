/**
 * 72. Add and Search Word - Data structure design
 * LeetCode #211 | Difficulty: Medium | Category: Tree / Trie
 *
 * Problem
 * -------
 * Design a data structure that supports adding new words and searching
 * for a word, where the search word may contain '.' as a wildcard that
 * matches any single letter.
 *
 * Example
 * -------
 * Input: addWord("bad"); addWord("dad"); addWord("mad");
 *        search("pad") -> false; search("bad") -> true;
 *        search(".ad") -> true; search("b..") -> true
 *
 * Constraints
 * -----------
 * 1 <= word.length <= 25, lowercase letters and '.' only in search.
 *
 * Approaches
 * ----------
 * 1. Brute force (`WordDictionaryBruteForce`) - A flat array of words; search
 *    compares the pattern against every word. addWord O(1), search O(N*L).
 * 2. Better (`WordDictionaryBetter`) - Words bucketed by length, so a search
 *    only compares against same-length words. addWord O(1), search O(N_len *
 *    L).
 * 3. Optimal (`WordDictionaryOptimal`) - Trie with DFS wildcard handling: a
 *    '.' tries every child at that depth, a letter follows a single edge.
 *    addWord O(L); search O(L) without dots, O(26^d * L) worst case with d
 *    dots.
 */
import assert from "node:assert/strict";

interface WordStore {
  addWord(word: string): void;
  search(word: string): boolean;
}

/** True if `word` matches `pattern`, where '.' matches any single letter. */
function matches(word: string, pattern: string): boolean {
  if (word.length !== pattern.length) return false;
  for (let i = 0; i < word.length; i++) {
    if (pattern[i] !== "." && pattern[i] !== word[i]) return false;
  }
  return true;
}

/** A flat array of words; search compares the pattern against every word. addWord O(1), search O(N*L). */
export class WordDictionaryBruteForce implements WordStore {
  private readonly words: string[] = [];

  addWord(word: string): void {
    this.words.push(word);
  }

  search(word: string): boolean {
    return this.words.some((w) => matches(w, word));
  }
}

/**
 * Words bucketed by length, so a search only compares against same-length
 * words. addWord O(1), search O(N_len * L).
 */
export class WordDictionaryBetter implements WordStore {
  private readonly byLength = new Map<number, string[]>();

  addWord(word: string): void {
    const bucket = this.byLength.get(word.length);
    if (bucket) bucket.push(word);
    else this.byLength.set(word.length, [word]);
  }

  search(word: string): boolean {
    return (this.byLength.get(word.length) ?? []).some((w) => matches(w, word));
  }
}

class TrieNode {
  readonly children = new Map<string, TrieNode>();
  isEnd = false;
}

/**
 * Trie with DFS wildcard handling: a '.' tries every child at that depth,
 * a letter follows a single edge. addWord O(L); search O(L) without dots,
 * O(26^d * L) worst case with d dots.
 */
export class WordDictionaryOptimal implements WordStore {
  private readonly root = new TrieNode();

  addWord(word: string): void {
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
    const dfs = (node: TrieNode, i: number): boolean => {
      if (i === word.length) return node.isEnd;
      if (word[i] === ".") {
        for (const child of node.children.values()) if (dfs(child, i + 1)) return true;
        return false;
      }
      const child = node.children.get(word[i]);
      return child !== undefined && dfs(child, i + 1);
    };
    return dfs(this.root, 0);
  }
}

if (import.meta.main) {
  for (const DictClass of [WordDictionaryBruteForce, WordDictionaryBetter, WordDictionaryOptimal]) {
    const wd = new DictClass();
    const name = DictClass.name;
    wd.addWord("bad");
    wd.addWord("dad");
    wd.addWord("mad");
    assert.equal(wd.search("pad"), false, name);
    assert.equal(wd.search("bad"), true, name);
    assert.equal(wd.search(".ad"), true, name);
    assert.equal(wd.search("b.."), true, name);
    assert.equal(wd.search("b.d"), true, name);
    assert.equal(wd.search("...."), false, name);
    assert.equal(wd.search("ba"), false, name);
  }
  console.log("All Add and Search Word tests passed.");
}
