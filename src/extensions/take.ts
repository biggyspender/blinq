import { Enumerable } from '../Enumerable'
import './takeWhile'
declare module '../Enumerable' {
  interface Enumerable<T> {
    take<T>(this: Enumerable<T>, numItems: number): Enumerable<T>
  }
}

//
function take<T>(this: Enumerable<T>, numItems: number): Enumerable<T> {
  return this.takeWhile((_, i) => i < numItems)
}
Enumerable.prototype.take = take
