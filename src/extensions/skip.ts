import { Enumerable } from '../Enumerable'
import './skipWhile'

declare module '../Enumerable' {
  interface Enumerable<T> {
    skip<T>(this: Enumerable<T>, numItems: number): Enumerable<T>
  }
}

function skip<T>(this: Enumerable<T>, numItems: number): Enumerable<T> {
  return this.skipWhile((_, i) => i < numItems)
}

Enumerable.prototype.skip = skip
