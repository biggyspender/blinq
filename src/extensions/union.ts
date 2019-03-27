import { Enumerable } from '../Enumerable'
import './concat'
import './distinct'
import { EqualityComparer } from '../blinq'

declare module '../Enumerable' {
  interface Enumerable<T> {
    union<T>(
      this: Enumerable<T>,
      seq: Iterable<T>,
      equalityComparer?: EqualityComparer<T>
    ): Enumerable<T>
  }
}

function union<T>(
  this: Enumerable<T>,
  seq: Iterable<T>,
  equalityComparer?: EqualityComparer<T>
): Enumerable<T> {
  return this.concat(seq).distinct(equalityComparer)
}
Enumerable.prototype.union = union
