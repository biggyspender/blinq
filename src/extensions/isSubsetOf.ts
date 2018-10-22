import { Enumerable } from '../Enumerable'

declare module '../Enumerable' {
  interface Enumerable<T> {
    isSubsetOf<T>(this: Enumerable<T>, seq: Iterable<T>): boolean
  }
}

function isSubsetOf<T>(this: Enumerable<T>, seq: Iterable<T>): boolean {
  const set = new Set(seq)
  return this.all(x => set.has(x))
}

Enumerable.prototype.isSubsetOf = isSubsetOf
