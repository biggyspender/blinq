import { Enumerable } from '../Enumerable'
import * as EnumerableGenerators from '../EnumerableGenerators'

declare module '../Enumerable' {
  interface Enumerable<T> {
    isSupersetOf<T>(this: Enumerable<T>, seq: Iterable<T>): boolean
  }
}

// <T>(this:Enumerable<T>,
function isSupersetOf<T>(this: Enumerable<T>, seq: Iterable<T>): boolean {
  return EnumerableGenerators.fromIterable(seq).isSubsetOf(this)
}

Enumerable.prototype.isSupersetOf = isSupersetOf
