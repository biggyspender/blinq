import { Enumerable } from '../Enumerable'
import { EqualityComparer } from '../blinq'
import { createComparerSet } from '../createComparerSet'

declare module '../Enumerable' {
  interface Enumerable<T> {
    intersect<T>(
      this: Enumerable<T>,
      seq: Iterable<T>,
      equalityComparer?: EqualityComparer<T>
    ): Enumerable<T>
  }
}

function intersect<T>(
  this: Enumerable<T>,
  seq: Iterable<T>,
  equalityComparer?: EqualityComparer<T>
): Enumerable<T> {
  const set: Set<T> = createComparerSet(0, equalityComparer)
  for (const item of seq) {
    set.add(item)
  }
  return this.where(item => set.has(item))
}

Enumerable.prototype.intersect = intersect
