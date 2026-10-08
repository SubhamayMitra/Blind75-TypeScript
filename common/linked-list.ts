/** Singly linked list node, matching LeetCode's `ListNode` definition. */
export class ListNode {
  val: number;
  next: ListNode | null;

  constructor(val = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

/** Build a linked list from an array of values; returns the head (or null). */
export function buildList(values: number[]): ListNode | null {
  const dummy = new ListNode();
  let current = dummy;
  for (const v of values) {
    current.next = new ListNode(v);
    current = current.next;
  }
  return dummy.next;
}

/** Collect a linked list's values into an array. */
export function listToArray(head: ListNode | null): number[] {
  const values: number[] = [];
  for (let node = head; node; node = node.next) values.push(node.val);
  return values;
}
