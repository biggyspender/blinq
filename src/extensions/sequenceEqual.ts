import { Enumerable } from '../Enumerable'

declare module '../Enumerable' {
  interface Enumerable<T> {
    sequenceEqual<T>(this: Enumerable<T>, seq: Iterable<T>): boolean
  }
}

//
function sequenceEqual<T>(this: Enumerable<T>, seq: Iterable<T>): boolean {
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
    if (it1Result.value !== it2Result.value) {
      return false
    }
  }
}
Enumerable.prototype.sequenceEqual = sequenceEqual
