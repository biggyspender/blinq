import { Enumerable } from '../Enumerable'
import { EqualityComparer } from '../blinq'
import { createComparerSet } from '../createComparerSet'

declare module '../Enumerable' {
  interface Enumerable<T> {
    except<T>(
      this: Enumerable<T>,
      seq: Iterable<T>,
      equalityComparer?: EqualityComparer<T>
    ): Enumerable<T>
  }
}

function except<T>(
  this: Enumerable<T>,
  seq: Iterable<T>,
  equalityComparer?: EqualityComparer<T>
): Enumerable<T> {
  const set: Set<T> = createComparerSet(0, equalityComparer)
  for (const item of seq) {
    set.add(item)
  }
  return this.where(item => !set.has(item))
}

Enumerable.prototype.except = except
