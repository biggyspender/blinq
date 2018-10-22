import { Enumerable } from '../Enumerable'

declare module '../Enumerable' {
  interface Enumerable<T> {
    sum(this: Enumerable<number>): number
  }
}

function sum(this: Enumerable<number>): number {
  return this.aggregate(0, (acc, val) => acc + val)
}

Enumerable.prototype.sum = sum
