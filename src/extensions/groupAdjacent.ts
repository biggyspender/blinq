import { Enumerable } from '../Enumerable'
import { IndexedSelector } from '../IndexedSelector'
import * as EnumerableGenerators from '../EnumerableGenerators'
import GroupedIterable from '../GroupedIterable'
import ArrayIterable from '../ArrayIterable'

declare module '../Enumerable' {
  interface Enumerable<T> {
    groupAdjacent<TSource, TKey, TElement, TResult>(
      this: Enumerable<TSource>,
      keySelector: IndexedSelector<TSource, TKey>,
      elementSelector: IndexedSelector<TSource, TElement>,
      resultSelector: (key: TKey, items: Enumerable<TElement>) => TResult
    ): Enumerable<TResult>
  }
}

function groupAdjacent<TSource, TKey, TElement, TResult>(
  this: Enumerable<TSource>,
  keySelector: IndexedSelector<TSource, TKey>,
  elementSelector: IndexedSelector<TSource, TElement>,
  resultSelector: (key: TKey, items: Enumerable<TElement>) => TResult
): Enumerable<TResult> {
  const source = this
  // nasty coverage edge-case whereby transformation to ES5 destroys istanbul comment, so we need to put
  // it on wider scope. ugh.
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
        if (typeof members !== 'undefined' && group === key) {
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
