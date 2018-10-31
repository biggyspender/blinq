import { Enumerable } from '../Enumerable'
import * as EnumerableGenerators from '../EnumerableGenerators'
import { IndexedSelector } from '../IndexedSelector'
declare module '../Enumerable' {
  interface Enumerable<T> {
    groupJoin<T, TInner, TKey, TOut>(
      this: Enumerable<T>,
      innerSeq: Iterable<TInner>,
      outerKeySelector: IndexedSelector<T, TKey>,
      innerKeySelector: IndexedSelector<TInner, TKey>,
      selector: (o: T, v: Enumerable<TInner>) => TOut
    ): Enumerable<TOut>
  }
}

function groupJoin<T, TInner, TKey, TOut>(
  this: Enumerable<T>,
  innerSeq: Iterable<TInner>,
  outerKeySelector: IndexedSelector<T, TKey>,
  innerKeySelector: IndexedSelector<TInner, TKey>,
  selector: (o: T, v: Enumerable<TInner>) => TOut
): Enumerable<TOut> {
  const innerSeqIt = EnumerableGenerators.fromIterable(innerSeq)
  const lookup = innerSeqIt.toLookup(innerKeySelector)
  const outerSeq = this

  return EnumerableGenerators.fromGenerator(function*() {
    let i = 0
    for (const outerItem of outerSeq) {
      let idx = i++
      const key = outerKeySelector(outerItem, idx)
      let innerItems: Enumerable<TInner> = lookup.get(key) || EnumerableGenerators.empty()

      yield selector(outerItem, innerItems)
    }
  })
}
Enumerable.prototype.groupJoin = groupJoin
