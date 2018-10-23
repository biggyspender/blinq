import { Enumerable } from '../Enumerable'

declare module '../Enumerable' {
  interface Enumerable<T> {
    flatten<TT>(this: Enumerable<Enumerable<TT>>): Enumerable<T>
  }
}

function flatten<T>(this: Enumerable<Enumerable<T>>): Enumerable<T> {
  return this.selectMany(x => x)
}

Enumerable.prototype.flatten = flatten
