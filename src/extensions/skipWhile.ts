import { Enumerable } from '../Enumerable'
import { IndexedPredicate } from '../IndexedPredicate'
import * as EnumerableGenerators from '../EnumerableGenerators'

declare module '../Enumerable' {
  interface Enumerable<T> {
    skipWhile<T>(this: Enumerable<T>, pred: IndexedPredicate<T>): Enumerable<T>
  }
}

function skipWhile<T>(this: Enumerable<T>, pred: IndexedPredicate<T>): Enumerable<T> {
  const src = this
  return EnumerableGenerators.fromGenerator(function*() {
    let i = 0
    let skip = true
    for (const item of src) {
      if (skip) {
        const result = pred(item, i++)
        if (result) {
          continue
        }
      }
      skip = false
      yield item
    }
  })
}
Enumerable.prototype.skipWhile = skipWhile
