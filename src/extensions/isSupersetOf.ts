import { Enumerable } from '../Enumerable'
import * as EnumerableGenerators from '../EnumerableGenerators'
import { EqualityComparer } from '../blinq'

declare module '../Enumerable' {
  interface Enumerable<T> {
    isSupersetOf<T>(
      this: Enumerable<T>,
      seq: Iterable<T>,
      equalityComparer?: EqualityComparer<T>
    ): boolean
  }
}

function isSupersetOf<T>(
  this: Enumerable<T>,
  seq: Iterable<T>,
  equalityComparer?: EqualityComparer<T>
): boolean {
  return EnumerableGenerators.fromIterable(seq).isSubsetOf(this, equalityComparer)
}

Enumerable.prototype.isSupersetOf = isSupersetOf
