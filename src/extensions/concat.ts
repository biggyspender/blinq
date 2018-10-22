import { Enumerable, IndexedSelector, getIdentity } from '../Enumerable'
const identity = getIdentity()

declare module '../Enumerable' {
  interface Enumerable<T> {
    concat<T>(this: Enumerable<T>, ...sequences: Array<Iterable<T>>): Enumerable<T>
  }
}

function concat<T>(this: Enumerable<T>, ...sequences: Array<Iterable<T>>): Enumerable<T> {
  const src = this
  return Enumerable.fromGenerator(function*() {
    for (const item of src) {
      yield item
    }
    for (const seq of sequences) {
      for (const item of seq) {
        yield item
      }
    }
  })
}

Enumerable.prototype.concat = concat
