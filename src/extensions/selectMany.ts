import { Enumerable, IndexedSelector } from '../Enumerable'
import * as EnumerableGenerators from '../EnumerableGenerators'

declare module '../Enumerable' {
  interface Enumerable<T> {
    selectMany<T, TOut>(
      this: Enumerable<T>,
      selector: IndexedSelector<T, Iterable<TOut>>
    ): Enumerable<TOut>
  }
}

//
function selectMany<T, TOut>(
  this: Enumerable<T>,
  selector: IndexedSelector<T, Iterable<TOut>>
): Enumerable<TOut> {
  const src = this
  return EnumerableGenerators.fromGenerator(function*() {
    let i = 0
    for (const seq of src) {
      for (const item of selector(seq, i++)) {
        yield item
      }
    }
  })
}
Enumerable.prototype.selectMany = selectMany
