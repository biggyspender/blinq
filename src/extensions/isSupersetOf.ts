import { Enumerable, IndexedSelector, getIdentity } from '../Enumerable'
const identity = getIdentity()

declare module '../Enumerable' {
  interface Enumerable<T> {
    isSupersetOf<T>(this: Enumerable<T>, seq: Iterable<T>): boolean
  }
}

// <T>(this:Enumerable<T>,
function isSupersetOf<T>(this: Enumerable<T>, seq: Iterable<T>): boolean {
  return Enumerable.fromIterable(seq).isSubsetOf(this)
}

Enumerable.prototype.isSupersetOf = isSupersetOf
