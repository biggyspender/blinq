import { Enumerable } from '../Enumerable'

declare module '../Enumerable' {
  interface Enumerable<T> {
    elementAt<T>(this: Enumerable<T>, index: number): T
  }
}

function elementAt<T>(this: Enumerable<T>, index: number): T {
  return this.single((x, i) => i === index)
}

Enumerable.prototype.elementAt = elementAt
