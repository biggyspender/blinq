import { Enumerable } from '../Enumerable'
import * as EnumerableGenerators from '../EnumerableGenerators'

declare module '../Enumerable' {
  interface Enumerable<T> {
    append<T>(this: Enumerable<T>, item: T): Enumerable<T>
  }
}

function append<T>(this: Enumerable<T>, item: T): Enumerable<T> {
  return this.concat(EnumerableGenerators.fromSingleValue(item))
}

Enumerable.prototype.append = append
