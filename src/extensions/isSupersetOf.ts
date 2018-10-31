import { Enumerable } from '../Enumerable'
import * as EnumerableGenerators from '../EnumerableGenerators'

declare module '../Enumerable' {
  interface Enumerable<T> {
    isSupersetOf<T>(this: Enumerable<T>, seq: Iterable<T>): boolean
  }
}

function isSupersetOf<T>(this: Enumerable<T>, seq: Iterable<T>): boolean {
  return EnumerableGenerators.fromIterable(seq).isSubsetOf(this)
}

Enumerable.prototype.isSupersetOf = isSupersetOf
