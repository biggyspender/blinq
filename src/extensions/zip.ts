import { Enumerable } from '../Enumerable'
import * as EnumerableGenerators from '../EnumerableGenerators'

declare module '../Enumerable' {
  interface Enumerable<T> {
    zip<T, TOther, TOut>(
      this: Enumerable<T>,
      seq: Iterable<TOther>,
      selector: (item1: T, item2: TOther) => TOut
    ): Enumerable<TOut>
  }
}

function zip<T, TOther, TOut>(
  this: Enumerable<T>,
  seq: Iterable<TOther>,
  selector: (item1: T, item2: TOther) => TOut
): Enumerable<TOut> {
  const src = this

  return EnumerableGenerators.fromGenerator(function*() {
    const it1 = src[Symbol.iterator]()
    const it2 = seq[Symbol.iterator]()

    for (;;) {
      const it1Result = it1.next()
      const it2Result = it2.next()

      if (it1Result.done || it2Result.done) {
        break
      }
      yield selector(it1Result.value, it2Result.value)
    }
  })
}
Enumerable.prototype.zip = zip
