import { Enumerable } from '../Enumerable'

declare module '../Enumerable' {
  interface Enumerable<T> {
    intersect<T>(this: Enumerable<T>, seq: Iterable<T>): Enumerable<T>
  }
}

function intersect<T>(this: Enumerable<T>, seq: Iterable<T>): Enumerable<T> {
  const set: Set<T> = new Set()
  for (const item of seq) {
    set.add(item)
  }
  return this.where(item => set.has(item))
}

Enumerable.prototype.intersect = intersect
