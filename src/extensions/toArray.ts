import { Enumerable } from '../Enumerable'

declare module '../Enumerable' {
  interface Enumerable<T> {
    toArray<T>(this: Enumerable<T>): T[]
  }
}

// <T>(this:Enumerable<T>,
function toArray<T>(this: Enumerable<T>): T[] {
  return [...this]
}
Enumerable.prototype.toArray = toArray
