import { Enumerable } from '../Enumerable'
import { IndexedPredicate } from '../IndexedPredicate'
import * as EnumerableGenerators from '../EnumerableGenerators'

declare module '../Enumerable' {
  interface Enumerable<T> {
    takeWhile<T>(this: Enumerable<T>, pred: IndexedPredicate<T>): Enumerable<T>
  }
}

//

function takeWhile<T>(this: Enumerable<T>, pred: IndexedPredicate<T>): Enumerable<T> {
  const src = this
  return EnumerableGenerators.fromGenerator(function*() {
    let i = 0
    for (const item of src) {
      const result = pred(item, i++)
      if (!result) {
        break
      }
      yield item
    }
  })
}

Enumerable.prototype.takeWhile = takeWhile
