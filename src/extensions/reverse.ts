import { Enumerable } from '../Enumerable'
import * as EnumerableGenerators from '../EnumerableGenerators'

declare module '../Enumerable' {
  interface Enumerable<T> {
    reverse<T>(this: Enumerable<T>): Enumerable<T>
  }
}

function reverse<T>(this: Enumerable<T>): Enumerable<T> {
  return EnumerableGenerators.fromGenerator(() => [...this].reverse())
}
Enumerable.prototype.reverse = reverse
