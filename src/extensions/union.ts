import { Enumerable } from '../Enumerable'
import './concat'
import './distinct'

declare module '../Enumerable' {
  interface Enumerable<T> {
    union<T>(this: Enumerable<T>, seq: Iterable<T>): Enumerable<T>
  }
}

function union<T>(this: Enumerable<T>, seq: Iterable<T>): Enumerable<T> {
  return this.concat(seq).distinct()
}
Enumerable.prototype.union = union
