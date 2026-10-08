# Blind 75 — TypeScript Solutions

Complete solutions to the classic [Blind 75](https://neetcode.io/practice/practice/blind75) interview-prep problem list, implemented in TypeScript. This is a TypeScript port of [Blind75-Python](https://github.com/SubhamayMitra/Blind75-Python), and keeps the same layout: each problem has its own file with the full problem statement and **three implementations**: a brute force, a better intermediate approach, and the optimal solution. Every approach notes its time and space complexity, and each file checks itself with test assertions.

## Structure

Problems are grouped into 10 category folders (matching the traditional Blind 75 breakdown), numbered 1–75 in the order the list is usually presented.

```
Folder                  Category                    Problems
01_array                Array                       10
02_binary               Binary / Bit Manipulation   5
03_dynamic_programming  Dynamic Programming         11
04_graph                Graph                       8
05_interval             Interval                    5
06_linked_list          Linked List                 6
07_matrix               Matrix                      4
08_string               String                      10
09_tree                 Tree / Trie                 14
10_heap                 Heap                        2
                                                    --
                        Total                       75

common/                 Shared helpers: ListNode, TreeNode (+ build/serialize
                        helpers for tests) and a generic binary Heap
scripts/run-all.ts      Runs every file's test suite and prints a summary
```

## Each solution file includes

- A header comment with the problem statement, an example, constraints, and a summary of every approach.
- A **brute force / naive** approach.
- A **better** approach (an intermediate optimization).
- The **optimal** approach (best known interview-grade complexity).
- Time and space complexity on every approach.
- An `if (import.meta.main)` block with test cases asserting that every approach returns the correct answer.

All approaches are exported, so you can import and compare them from other files:

```ts
import { twoSumOptimal } from "./01_array/01_two_sum.ts";
```

## Running

The files use only erasable TypeScript syntax, so Node runs them directly with no build step (Node's built-in type stripping).

```bash
npm install                         # TypeScript + @types/node, needed only for type checking

node 01_array/01_two_sum.ts         # run one problem's tests
# All Two Sum tests passed.

npm test                            # run all 75 problems
npm test -- 09_tree                 # run only the files whose path matches
npm run typecheck                   # strict type check with tsc
```

## Notes on the TypeScript port

- **Heap:** JavaScript has no built-in priority queue (Python has `heapq`), so [`common/heap.ts`](common/heap.ts) provides a small generic binary heap. Meeting Rooms II, Merge k Sorted Lists, Top K Frequent Elements and Find Median from Data Stream use it.
- **Bit manipulation:** JavaScript bitwise operators work on 32-bit two's-complement integers, so Sum of Two Integers needs no masking. Unsigned results (Reverse Bits, Number of 1 Bits) use `>>> 0`.
- **Approach choices:** where an intermediate approach in the Python reference was intentionally buggy or only a variant of another approach, this port uses a correct alternative with a clear trade-off. For example, Maximum Product Subarray's "better" approach is a prefix/suffix product scan, and Find Median's brute force sorts on every query while its "better" approach uses binary-search insertion.

## Problem Index

### 01. Array

| # | Problem | LeetCode | Difficulty | File |
|---|---------|----------|------------|------|
| 1 | Two Sum | #1 | Easy | [`01_two_sum.ts`](01_array/01_two_sum.ts) |
| 2 | Best Time to Buy and Sell Stock | #121 | Easy | [`02_best_time_to_buy_and_sell_stock.ts`](01_array/02_best_time_to_buy_and_sell_stock.ts) |
| 3 | Contains Duplicate | #217 | Easy | [`03_contains_duplicate.ts`](01_array/03_contains_duplicate.ts) |
| 4 | Product of Array Except Self | #238 | Medium | [`04_product_of_array_except_self.ts`](01_array/04_product_of_array_except_self.ts) |
| 5 | Maximum Subarray | #53 | Medium | [`05_maximum_subarray.ts`](01_array/05_maximum_subarray.ts) |
| 6 | Maximum Product Subarray | #152 | Medium | [`06_maximum_product_subarray.ts`](01_array/06_maximum_product_subarray.ts) |
| 7 | Find Minimum in Rotated Sorted Array | #153 | Medium | [`07_find_minimum_in_rotated_sorted_array.ts`](01_array/07_find_minimum_in_rotated_sorted_array.ts) |
| 8 | Search in Rotated Sorted Array | #33 | Medium | [`08_search_in_rotated_sorted_array.ts`](01_array/08_search_in_rotated_sorted_array.ts) |
| 9 | 3Sum | #15 | Medium | [`09_3sum.ts`](01_array/09_3sum.ts) |
| 10 | Container With Most Water | #11 | Medium | [`10_container_with_most_water.ts`](01_array/10_container_with_most_water.ts) |

### 02. Binary / Bit Manipulation

| # | Problem | LeetCode | Difficulty | File |
|---|---------|----------|------------|------|
| 11 | Sum of Two Integers | #371 | Medium | [`11_sum_of_two_integers.ts`](02_binary/11_sum_of_two_integers.ts) |
| 12 | Number of 1 Bits (Hamming Weight) | #191 | Easy | [`12_number_of_1_bits.ts`](02_binary/12_number_of_1_bits.ts) |
| 13 | Counting Bits | #338 | Easy | [`13_counting_bits.ts`](02_binary/13_counting_bits.ts) |
| 14 | Missing Number | #268 | Easy | [`14_missing_number.ts`](02_binary/14_missing_number.ts) |
| 15 | Reverse Bits | #190 | Easy | [`15_reverse_bits.ts`](02_binary/15_reverse_bits.ts) |

### 03. Dynamic Programming

| # | Problem | LeetCode | Difficulty | File |
|---|---------|----------|------------|------|
| 16 | Climbing Stairs | #70 | Easy | [`16_climbing_stairs.ts`](03_dynamic_programming/16_climbing_stairs.ts) |
| 17 | Coin Change | #322 | Medium | [`17_coin_change.ts`](03_dynamic_programming/17_coin_change.ts) |
| 18 | Longest Increasing Subsequence | #300 | Medium | [`18_longest_increasing_subsequence.ts`](03_dynamic_programming/18_longest_increasing_subsequence.ts) |
| 19 | Longest Common Subsequence | #1143 | Medium | [`19_longest_common_subsequence.ts`](03_dynamic_programming/19_longest_common_subsequence.ts) |
| 20 | Word Break | #139 | Medium | [`20_word_break.ts`](03_dynamic_programming/20_word_break.ts) |
| 21 | Combination Sum IV | #377 | Medium | [`21_combination_sum_iv.ts`](03_dynamic_programming/21_combination_sum_iv.ts) |
| 22 | House Robber | #198 | Medium | [`22_house_robber.ts`](03_dynamic_programming/22_house_robber.ts) |
| 23 | House Robber II | #213 | Medium | [`23_house_robber_ii.ts`](03_dynamic_programming/23_house_robber_ii.ts) |
| 24 | Decode Ways | #91 | Medium | [`24_decode_ways.ts`](03_dynamic_programming/24_decode_ways.ts) |
| 25 | Unique Paths | #62 | Medium | [`25_unique_paths.ts`](03_dynamic_programming/25_unique_paths.ts) |
| 26 | Jump Game | #55 | Medium | [`26_jump_game.ts`](03_dynamic_programming/26_jump_game.ts) |

### 04. Graph

| # | Problem | LeetCode | Difficulty | File |
|---|---------|----------|------------|------|
| 27 | Clone Graph | #133 | Medium | [`27_clone_graph.ts`](04_graph/27_clone_graph.ts) |
| 28 | Course Schedule | #207 | Medium | [`28_course_schedule.ts`](04_graph/28_course_schedule.ts) |
| 29 | Pacific Atlantic Water Flow | #417 | Medium | [`29_pacific_atlantic_water_flow.ts`](04_graph/29_pacific_atlantic_water_flow.ts) |
| 30 | Number of Islands | #200 | Medium | [`30_number_of_islands.ts`](04_graph/30_number_of_islands.ts) |
| 31 | Longest Consecutive Sequence | #128 | Medium | [`31_longest_consecutive_sequence.ts`](04_graph/31_longest_consecutive_sequence.ts) |
| 32 | Alien Dictionary | #269 (Premium) | Hard | [`32_alien_dictionary.ts`](04_graph/32_alien_dictionary.ts) |
| 33 | Graph Valid Tree | #261 (Premium) | Medium | [`33_graph_valid_tree.ts`](04_graph/33_graph_valid_tree.ts) |
| 34 | Number of Connected Components in an Undirected Graph | #323 (Premium) | Medium | [`34_number_of_connected_components.ts`](04_graph/34_number_of_connected_components.ts) |

### 05. Interval

| # | Problem | LeetCode | Difficulty | File |
|---|---------|----------|------------|------|
| 35 | Insert Interval | #57 | Medium | [`35_insert_interval.ts`](05_interval/35_insert_interval.ts) |
| 36 | Merge Intervals | #56 | Medium | [`36_merge_intervals.ts`](05_interval/36_merge_intervals.ts) |
| 37 | Non-overlapping Intervals | #435 | Medium | [`37_non_overlapping_intervals.ts`](05_interval/37_non_overlapping_intervals.ts) |
| 38 | Meeting Rooms | #252 (Premium) | Easy | [`38_meeting_rooms.ts`](05_interval/38_meeting_rooms.ts) |
| 39 | Meeting Rooms II | #253 (Premium) | Medium | [`39_meeting_rooms_ii.ts`](05_interval/39_meeting_rooms_ii.ts) |

### 06. Linked List

| # | Problem | LeetCode | Difficulty | File |
|---|---------|----------|------------|------|
| 40 | Reverse a Linked List | #206 | Easy | [`40_reverse_linked_list.ts`](06_linked_list/40_reverse_linked_list.ts) |
| 41 | Linked List Cycle (Detect Cycle in a Linked List) | #141 | Easy | [`41_linked_list_cycle.ts`](06_linked_list/41_linked_list_cycle.ts) |
| 42 | Merge Two Sorted Lists | #21 | Easy | [`42_merge_two_sorted_lists.ts`](06_linked_list/42_merge_two_sorted_lists.ts) |
| 43 | Merge k Sorted Lists | #23 | Hard | [`43_merge_k_sorted_lists.ts`](06_linked_list/43_merge_k_sorted_lists.ts) |
| 44 | Remove Nth Node From End Of List | #19 | Medium | [`44_remove_nth_node_from_end_of_list.ts`](06_linked_list/44_remove_nth_node_from_end_of_list.ts) |
| 45 | Reorder List | #143 | Medium | [`45_reorder_list.ts`](06_linked_list/45_reorder_list.ts) |

### 07. Matrix

| # | Problem | LeetCode | Difficulty | File |
|---|---------|----------|------------|------|
| 46 | Set Matrix Zeroes | #73 | Medium | [`46_set_matrix_zeroes.ts`](07_matrix/46_set_matrix_zeroes.ts) |
| 47 | Spiral Matrix | #54 | Medium | [`47_spiral_matrix.ts`](07_matrix/47_spiral_matrix.ts) |
| 48 | Rotate Image | #48 | Medium | [`48_rotate_image.ts`](07_matrix/48_rotate_image.ts) |
| 49 | Word Search | #79 | Medium | [`49_word_search.ts`](07_matrix/49_word_search.ts) |

### 08. String

| # | Problem | LeetCode | Difficulty | File |
|---|---------|----------|------------|------|
| 50 | Longest Substring Without Repeating Characters | #3 | Medium | [`50_longest_substring_without_repeating_characters.ts`](08_string/50_longest_substring_without_repeating_characters.ts) |
| 51 | Longest Repeating Character Replacement | #424 | Medium | [`51_longest_repeating_character_replacement.ts`](08_string/51_longest_repeating_character_replacement.ts) |
| 52 | Minimum Window Substring | #76 | Hard | [`52_minimum_window_substring.ts`](08_string/52_minimum_window_substring.ts) |
| 53 | Valid Anagram | #242 | Easy | [`53_valid_anagram.ts`](08_string/53_valid_anagram.ts) |
| 54 | Group Anagrams | #49 | Medium | [`54_group_anagrams.ts`](08_string/54_group_anagrams.ts) |
| 55 | Valid Parentheses | #20 | Easy | [`55_valid_parentheses.ts`](08_string/55_valid_parentheses.ts) |
| 56 | Valid Palindrome | #125 | Easy | [`56_valid_palindrome.ts`](08_string/56_valid_palindrome.ts) |
| 57 | Longest Palindromic Substring | #5 | Medium | [`57_longest_palindromic_substring.ts`](08_string/57_longest_palindromic_substring.ts) |
| 58 | Palindromic Substrings | #647 | Medium | [`58_palindromic_substrings.ts`](08_string/58_palindromic_substrings.ts) |
| 59 | Encode and Decode Strings | #271 (Premium) | Medium | [`59_encode_and_decode_strings.ts`](08_string/59_encode_and_decode_strings.ts) |

### 09. Tree / Trie

| # | Problem | LeetCode | Difficulty | File |
|---|---------|----------|------------|------|
| 60 | Maximum Depth of Binary Tree | #104 | Easy | [`60_maximum_depth_of_binary_tree.ts`](09_tree/60_maximum_depth_of_binary_tree.ts) |
| 61 | Same Tree | #100 | Easy | [`61_same_tree.ts`](09_tree/61_same_tree.ts) |
| 62 | Invert/Flip Binary Tree | #226 | Easy | [`62_invert_binary_tree.ts`](09_tree/62_invert_binary_tree.ts) |
| 63 | Binary Tree Maximum Path Sum | #124 | Hard | [`63_binary_tree_maximum_path_sum.ts`](09_tree/63_binary_tree_maximum_path_sum.ts) |
| 64 | Binary Tree Level Order Traversal | #102 | Medium | [`64_binary_tree_level_order_traversal.ts`](09_tree/64_binary_tree_level_order_traversal.ts) |
| 65 | Serialize and Deserialize Binary Tree | #297 | Hard | [`65_serialize_and_deserialize_binary_tree.ts`](09_tree/65_serialize_and_deserialize_binary_tree.ts) |
| 66 | Subtree of Another Tree | #572 | Easy | [`66_subtree_of_another_tree.ts`](09_tree/66_subtree_of_another_tree.ts) |
| 67 | Construct Binary Tree from Preorder and Inorder Traversal | #105 | Medium | [`67_construct_binary_tree_from_preorder_and_inorder_traversal.ts`](09_tree/67_construct_binary_tree_from_preorder_and_inorder_traversal.ts) |
| 68 | Validate Binary Search Tree | #98 | Medium | [`68_validate_binary_search_tree.ts`](09_tree/68_validate_binary_search_tree.ts) |
| 69 | Kth Smallest Element in a BST | #230 | Medium | [`69_kth_smallest_element_in_a_bst.ts`](09_tree/69_kth_smallest_element_in_a_bst.ts) |
| 70 | Lowest Common Ancestor of a Binary Search Tree | #235 | Medium | [`70_lowest_common_ancestor_of_bst.ts`](09_tree/70_lowest_common_ancestor_of_bst.ts) |
| 71 | Implement Trie (Prefix Tree) | #208 | Medium | [`71_implement_trie.ts`](09_tree/71_implement_trie.ts) |
| 72 | Add and Search Word - Data structure design | #211 | Medium | [`72_add_and_search_word.ts`](09_tree/72_add_and_search_word.ts) |
| 73 | Word Search II | #212 | Hard | [`73_word_search_ii.ts`](09_tree/73_word_search_ii.ts) |

### 10. Heap

| # | Problem | LeetCode | Difficulty | File |
|---|---------|----------|------------|------|
| 74 | Top K Frequent Elements | #347 | Medium | [`74_top_k_frequent_elements.ts`](10_heap/74_top_k_frequent_elements.ts) |
| 75 | Find Median from Data Stream | #295 | Hard | [`75_find_median_from_data_stream.ts`](10_heap/75_find_median_from_data_stream.ts) |

## Requirements

Node.js 24.2+ (for unflagged type stripping and `import.meta.main`). The solution files have no runtime dependencies.
