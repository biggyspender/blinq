import { Enumerable } from '../Enumerable'
import { IndexedPredicate } from '../IndexedPredicate'
import * as EnumerableGenerators from '../EnumerableGenerators'

declare module '../Enumerable' {
  interface Enumerable<T> {
    skipWhile<T>(this: Enumerable<T>, pred: IndexedPredicate<T>): Enumerable<T>
  }
}

// <T>(this:Enumerable<T>,
function skipWhile<T>(this: Enumerable<T>, pred: IndexedPredicate<T>): Enumerable<T> {
  const src = this
  return EnumerableGenerators.fromGenerator(function*() {
    let i = 0
    for (const item of src) {
      const result = pred(item, i++)
      if (result) {
        continue
      }
      yield item
    }
  })
}
Enumerable.prototype.skipWhile = skipWhile
