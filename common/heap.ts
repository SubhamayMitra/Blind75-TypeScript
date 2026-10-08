/**
 * Binary heap ordered by a comparator. JavaScript has no built-in priority
 * queue (Python's `heapq` equivalent), so this fills that gap.
 *
 * `compare(a, b) < 0` means `a` has higher priority (comes out first), so
 * `new Heap<number>((a, b) => a - b)` is a min-heap and `(a, b) => b - a`
 * is a max-heap.
 */
export class Heap<T> {
  private readonly items: T[] = [];
  private readonly compare: (a: T, b: T) => number;

  constructor(compare: (a: T, b: T) => number, initial: Iterable<T> = []) {
    this.compare = compare;
    for (const item of initial) this.push(item);
  }

  get size(): number {
    return this.items.length;
  }

  peek(): T | undefined {
    return this.items[0];
  }

  push(item: T): void {
    this.items.push(item);
    this.siftUp(this.items.length - 1);
  }

  pop(): T | undefined {
    const items = this.items;
    if (items.length === 0) return undefined;
    const top = items[0];
    const last = items.pop() as T;
    if (items.length > 0) {
      items[0] = last;
      this.siftDown(0);
    }
    return top;
  }

  /** Pop the top item and push `item` in one O(log n) step (like `heapq.heapreplace`). */
  replace(item: T): T | undefined {
    if (this.items.length === 0) {
      this.push(item);
      return undefined;
    }
    const top = this.items[0];
    this.items[0] = item;
    this.siftDown(0);
    return top;
  }

  private siftUp(index: number): void {
    const items = this.items;
    while (index > 0) {
      const parent = (index - 1) >> 1;
      if (this.compare(items[index], items[parent]) >= 0) break;
      [items[index], items[parent]] = [items[parent], items[index]];
      index = parent;
    }
  }

  private siftDown(index: number): void {
    const items = this.items;
    const n = items.length;
    for (;;) {
      const left = 2 * index + 1;
      const right = left + 1;
      let best = index;
      if (left < n && this.compare(items[left], items[best]) < 0) best = left;
      if (right < n && this.compare(items[right], items[best]) < 0) best = right;
      if (best === index) return;
      [items[index], items[best]] = [items[best], items[index]];
      index = best;
    }
  }
}
