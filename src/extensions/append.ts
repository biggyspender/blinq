import { Enumerable } from '../Enumerable'

declare module '../Enumerable' {
  interface Enumerable<T> {
    append<T>(this: Enumerable<T>, item: T): Enumerable<T>
  }
}

function append<T>(this: Enumerable<T>, item: T): Enumerable<T> {
  return this.concat(Enumerable.fromSingleValue(item))
}

Enumerable.prototype.append = append
