import { Enumerable } from '../Enumerable'
import { EqualityComparer } from '../blinq'

declare module '../Enumerable' {
  interface Enumerable<T> {
    sequenceEqual<T>(
      this: Enumerable<T>,
      seq: Iterable<T>,
      equalityComparer?: EqualityComparer<T>
    ): boolean
  }
}

//
function sequenceEqual<T>(
  this: Enumerable<T>,
  seq: Iterable<T>,
  equalityComparer?: EqualityComparer<T>
): boolean {
  const eq = equalityComparer
    ? (a: T | undefined, b: T | undefined) =>
        a != null && b != null && equalityComparer.equals(a, b)
    : (a: T | undefined, b: T | undefined) => a != null && b != null && a === b
  const it1 = this[Symbol.iterator]()
  const it2 = seq[Symbol.iterator]()
  for (;;) {
    const it1Result = it1.next()
    const it2Result = it2.next()
    if (it1Result.done && it2Result.done) {
      return true
    }
    if (it1Result.done || it2Result.done) {
      return false
    }
    if (!eq(it1Result.value, it2Result.value)) {
      return false
    }
  }
}
Enumerable.prototype.sequenceEqual = sequenceEqual
