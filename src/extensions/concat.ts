import { Enumerable } from '../Enumerable'
import * as EnumerableGenerators from '../EnumerableGenerators'

declare module '../Enumerable' {
  interface Enumerable<T> {
    concat<T>(this: Enumerable<T>, ...sequences: Array<Iterable<T>>): Enumerable<T>
  }
}

function concat<T>(this: Enumerable<T>, ...sequences: Array<Iterable<T>>): Enumerable<T> {
  const src = this
  return EnumerableGenerators.fromGenerator(function*() {
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
