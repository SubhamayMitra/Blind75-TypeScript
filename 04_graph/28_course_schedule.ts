/**
 * 28. Course Schedule
 * LeetCode #207 | Difficulty: Medium | Category: Graph
 *
 * Problem
 * -------
 * There are `numCourses` courses labeled 0 to numCourses-1. Given an array
 * of prerequisite pairs `prerequisites[i] = [a, b]` meaning you must take
 * course b before course a, return true if you can finish all courses
 * (i.e., the prerequisite graph has no cycle).
 *
 * Example
 * -------
 * Input: numCourses = 2, prerequisites = [[1, 0]]
 * Output: true
 *
 * Constraints
 * -----------
 * 1 <= numCourses <= 2000
 *
 * Approaches
 * ----------
 * 1. Brute force (`canFinishBruteForce`) - Repeatedly scan every course and
 *    remove any whose prerequisites are all taken. If a full pass removes
 *    nothing while courses remain, there is a cycle. (Kahn's algorithm without
 *    a queue.) O(V * (V + E)) time, O(V + E) space.
 * 2. Better (`canFinishBetter`) - DFS cycle detection with three colours: 0 =
 *    unvisited, 1 = on the current DFS path, 2 = fully explored. Reaching a
 *    colour-1 node means a cycle. O(V + E) time, O(V + E) space.
 * 3. Optimal (`canFinishOptimal`) - Kahn's BFS topological sort: start from
 *    courses with in-degree 0 and peel them off; if every course gets
 *    processed there is no cycle. O(V + E) time, O(V + E) space.
 */
import assert from "node:assert/strict";

/**
 * Repeatedly scan every course and remove any whose prerequisites are all
 * taken. If a full pass removes nothing while courses remain, there is a
 * cycle. (Kahn's algorithm without a queue.) O(V * (V + E)) time, O(V + E) space.
 */
export function canFinishBruteForce(numCourses: number, prerequisites: number[][]): boolean {
  const needs: number[][] = Array.from({ length: numCourses }, () => []);
  for (const [course, pre] of prerequisites) needs[course].push(pre);
  const taken: boolean[] = new Array(numCourses).fill(false);
  let remaining = numCourses;
  while (remaining > 0) {
    let progressed = false;
    for (let c = 0; c < numCourses; c++) {
      if (!taken[c] && needs[c].every((p) => taken[p])) {
        taken[c] = true;
        remaining--;
        progressed = true;
      }
    }
    if (!progressed) return false;
  }
  return true;
}

/**
 * DFS cycle detection with three colours: 0 = unvisited, 1 = on the current
 * DFS path, 2 = fully explored. Reaching a colour-1 node means a cycle.
 * O(V + E) time, O(V + E) space.
 */
export function canFinishBetter(numCourses: number, prerequisites: number[][]): boolean {
  const graph: number[][] = Array.from({ length: numCourses }, () => []);
  for (const [course, pre] of prerequisites) graph[pre].push(course);
  const state: number[] = new Array(numCourses).fill(0);

  const hasCycle = (node: number): boolean => {
    if (state[node] === 1) return true;
    if (state[node] === 2) return false;
    state[node] = 1;
    for (const next of graph[node]) {
      if (hasCycle(next)) return true;
    }
    state[node] = 2;
    return false;
  };

  for (let c = 0; c < numCourses; c++) {
    if (hasCycle(c)) return false;
  }
  return true;
}

/**
 * Kahn's BFS topological sort: start from courses with in-degree 0 and
 * peel them off; if every course gets processed there is no cycle.
 * O(V + E) time, O(V + E) space.
 */
export function canFinishOptimal(numCourses: number, prerequisites: number[][]): boolean {
  const graph: number[][] = Array.from({ length: numCourses }, () => []);
  const inDegree: number[] = new Array(numCourses).fill(0);
  for (const [course, pre] of prerequisites) {
    graph[pre].push(course);
    inDegree[course]++;
  }
  const queue: number[] = [];
  for (let c = 0; c < numCourses; c++) if (inDegree[c] === 0) queue.push(c);

  let processed = 0;
  for (let head = 0; head < queue.length; head++) {
    processed++;
    for (const next of graph[queue[head]]) {
      if (--inDegree[next] === 0) queue.push(next);
    }
  }
  return processed === numCourses;
}

if (import.meta.main) {
  const tests: [number, number[][], boolean][] = [
    [2, [[1, 0]], true],
    [2, [[1, 0], [0, 1]], false],
    [1, [], true],
    [3, [[1, 0], [2, 1]], true],
    [3, [[0, 1], [1, 2], [2, 0]], false],
  ];
  for (const [numCourses, prereqs, expected] of tests) {
    for (const fn of [canFinishBruteForce, canFinishBetter, canFinishOptimal]) {
      assert.equal(fn(numCourses, prereqs), expected, `${fn.name}(${numCourses}, ${JSON.stringify(prereqs)})`);
    }
  }
  console.log("All Course Schedule tests passed.");
}
