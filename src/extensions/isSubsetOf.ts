import { Enumerable } from '../Enumerable'
import { EqualityComparer } from '../blinq'
import { createComparerSet } from '../createComparerSet'

declare module '../Enumerable' {
  interface Enumerable<T> {
    isSubsetOf<T>(
      this: Enumerable<T>,
      seq: Iterable<T>,
      equalityComparer?: EqualityComparer<T>
    ): boolean
  }
}

function isSubsetOf<T>(
  this: Enumerable<T>,
  seq: Iterable<T>,
  equalityComparer?: EqualityComparer<T>
): boolean {
  const set = createComparerSet(0, equalityComparer)
  for (const x of seq) {
    set.add(x)
  }
  return this.all(x => set.has(x))
}

Enumerable.prototype.isSubsetOf = isSubsetOf
