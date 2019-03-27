import { Enumerable } from '../Enumerable'
import { IndexedSelector } from '../IndexedSelector'
import * as EnumerableGenerators from '../EnumerableGenerators'
import ArrayIterable from '../ArrayIterable'
import { EqualityComparer } from '../blinq'

declare module '../Enumerable' {
  interface Enumerable<T> {
    groupAdjacent<TSource, TKey, TElement, TResult>(
      this: Enumerable<TSource>,
      keySelector: IndexedSelector<TSource, TKey>,
      elementSelector: IndexedSelector<TSource, TElement>,
      resultSelector: (key: TKey, items: Enumerable<TElement>) => TResult,
      equalityComparer?: EqualityComparer<TKey>
    ): Enumerable<TResult>
  }
}

function groupAdjacent<TSource, TKey, TElement, TResult>(
  this: Enumerable<TSource>,
  keySelector: IndexedSelector<TSource, TKey>,
  elementSelector: IndexedSelector<TSource, TElement>,
  resultSelector: (key: TKey, items: Enumerable<TElement>) => TResult,
  equalityComparer?: EqualityComparer<TKey>
): Enumerable<TResult> {
  const source = this
  const eq = equalityComparer
    ? (a: TKey | undefined, b: TKey | undefined) =>
        typeof a !== 'undefined' && typeof b !== 'undefined' && equalityComparer.equals(a, b)
    : (a: TKey | undefined, b: TKey | undefined) =>
        typeof a !== 'undefined' && typeof b !== 'undefined' && a === b
  // nasty coverage edge-case whereby transformation to ES5 destroys istanbul comment, so we need to put
  // it on wider scope. ugh.a
  return EnumerableGenerators.fromGenerator(
    /* istanbul ignore next */ function*() {
      const iterator = source[Symbol.iterator]()

      let group: TKey | undefined = undefined
      let members: ArrayIterable<TElement> | undefined = undefined

      let i = 0
      let itResult
      while (!(itResult = iterator.next()).done) {
        const idx = i++
        const key = keySelector(itResult.value, idx)
        const element = elementSelector(itResult.value, idx)
        if (typeof members !== 'undefined' && eq(group, key)) {
          members.push(element)
        } else {
          if (typeof members !== 'undefined' && typeof group !== 'undefined') {
            yield resultSelector(group, EnumerableGenerators.fromIterable(members))
          }
          group = key
          members = new ArrayIterable<TElement>([element])
        }
      }
      if (typeof members !== 'undefined' && typeof group !== 'undefined') {
        yield resultSelector(group, EnumerableGenerators.fromIterable(members))
      }
    }
  )
}
Enumerable.prototype.groupAdjacent = groupAdjacent
