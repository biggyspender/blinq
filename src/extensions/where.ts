import { Enumerable } from '../Enumerable'
import { IndexedPredicate } from '../IndexedPredicate'

import * as EnumerableGenerators from '../EnumerableGenerators'

declare module '../Enumerable' {
  interface Enumerable<T> {
    where<T>(this: Enumerable<T>, pred: IndexedPredicate<T>): Enumerable<T>
  }
}

//
function where<T>(this: Enumerable<T>, pred: IndexedPredicate<T>): Enumerable<T> {
  const src = this
  return EnumerableGenerators.fromGenerator(function*() {
    let i = 0
    for (const x of src) {
      if (pred(x, i++)) {
        yield x
      }
    }
  })
}
Enumerable.prototype.where = where
