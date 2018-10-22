import { Enumerable } from '../Enumerable'
import * as EnumerableGenerators from '../EnumerableGenerators'

declare module '../Enumerable' {
  interface Enumerable<T> {
    prepend<T>(this: Enumerable<T>, item: T): Enumerable<T>
  }
}

//
function prepend<T>(this: Enumerable<T>, item: T): Enumerable<T> {
  return EnumerableGenerators.fromSingleValue(item).concat(this)
}
Enumerable.prototype.prepend = prepend
