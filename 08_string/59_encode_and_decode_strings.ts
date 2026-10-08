/**
 * 59. Encode and Decode Strings
 * LeetCode #271 (Premium) | Difficulty: Medium | Category: String
 *
 * Problem
 * -------
 * Design an algorithm to encode a list of strings to a single string, and
 * decode that string back to the original list of strings. The encoding
 * must handle any characters (including delimiters you might otherwise
 * pick) safely.
 *
 * Example
 * -------
 * Input: strs = ["lint", "code", "love", "you"]
 * Encoded -> some single string representation
 * Decoded -> ["lint", "code", "love", "you"]
 *
 * Constraints
 * -----------
 * 0 <= strs.length <= 200, strings may contain any ASCII character
 * including the naive delimiter candidates like ',' or '#'.
 *
 * Approaches
 * ----------
 * 1. Brute force (`encodeNaive`) - Naive (UNSAFE): join with a "rare"
 *    delimiter. Breaks as soon as any string contains a comma, and cannot tell
 *    [] apart from [""]. Shown only to motivate the safe schemes. O(total
 *    length) time and space.
 * 2. Better (`encodeBetter`) - Better (escaping): escape "\" as "\\" and ","
 *    as "\," inside each string, then join with ",". Decoding walks the text,
 *    honouring escapes. Correct for any content except the [] vs [""]
 *    ambiguity shared by every join-based scheme. O(total length) time and
 *    space.
 * 3. Optimal (`encodeOptimal`) - Optimal (length-prefixed): write each string
 *    as `<length>#<string>`. The decoder reads digits up to '#', then takes
 *    exactly that many characters, so the content can contain anything
 *    (including '#' and digits), and [] vs [""] is unambiguous. O(total
 *    length) time and space.
 */
import assert from "node:assert/strict";

/**
 * Naive (UNSAFE): join with a "rare" delimiter. Breaks as soon as any
 * string contains a comma, and cannot tell [] apart from [""].
 * Shown only to motivate the safe schemes. O(total length) time and space.
 */
export function encodeNaive(strs: string[]): string {
  return strs.join(",");
}

export function decodeNaive(s: string): string[] {
  return s === "" ? [] : s.split(",");
}

/**
 * Better (escaping): escape "\" as "\\" and "," as "\," inside each string,
 * then join with ",". Decoding walks the text, honouring escapes.
 * Correct for any content except the [] vs [""] ambiguity shared by every
 * join-based scheme. O(total length) time and space.
 */
export function encodeBetter(strs: string[]): string {
  return strs.map((s) => s.replaceAll("\\", "\\\\").replaceAll(",", "\\,")).join(",");
}

export function decodeBetter(s: string): string[] {
  if (s === "") return [];
  const result: string[] = [];
  let current = "";
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "\\") {
      current += s[++i];
    } else if (s[i] === ",") {
      result.push(current);
      current = "";
    } else {
      current += s[i];
    }
  }
  result.push(current);
  return result;
}

/**
 * Optimal (length-prefixed): write each string as `<length>#<string>`.
 * The decoder reads digits up to '#', then takes exactly that many
 * characters, so the content can contain anything (including '#' and
 * digits), and [] vs [""] is unambiguous. O(total length) time and space.
 */
export function encodeOptimal(strs: string[]): string {
  return strs.map((s) => `${s.length}#${s}`).join("");
}

export function decodeOptimal(s: string): string[] {
  const result: string[] = [];
  let i = 0;
  while (i < s.length) {
    const hash = s.indexOf("#", i);
    const length = Number(s.slice(i, hash));
    result.push(s.slice(hash + 1, hash + 1 + length));
    i = hash + 1 + length;
  }
  return result;
}

if (import.meta.main) {
  // Every join-based scheme maps both [] and [""] to "", so [""] is only
  // tested against the length-prefixed encoding.
  const delimiterBasedTests = [
    ["lint", "code", "love", "you"],
    [],
    ["", ""],
    ["4#lint", "co,de", "back\\slash"],
  ];
  const safeNaiveTests = [["lint", "code", "love", "you"]];

  for (const strs of safeNaiveTests) {
    assert.deepEqual(decodeNaive(encodeNaive(strs)), strs, `naive ${JSON.stringify(strs)}`);
  }
  assert.notDeepEqual(decodeNaive(encodeNaive(["co,de"])), ["co,de"], "naive should break on commas");
  for (const strs of delimiterBasedTests) {
    assert.deepEqual(decodeBetter(encodeBetter(strs)), strs, `better ${JSON.stringify(strs)}`);
  }
  for (const strs of [...delimiterBasedTests, [""], ["12#ab", "#", ""]]) {
    assert.deepEqual(decodeOptimal(encodeOptimal(strs)), strs, `optimal ${JSON.stringify(strs)}`);
  }
  console.log("All Encode and Decode Strings tests passed.");
}
