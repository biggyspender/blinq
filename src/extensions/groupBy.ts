import { Enumerable } from '../Enumerable'
import { IndexedSelector } from '../IndexedSelector'
import GroupedIterable from '../GroupedIterable'
import { EqualityComparer } from '../blinq'

declare module '../Enumerable' {
  interface Enumerable<T> {
    groupBy<TKey>(
      this: Enumerable<T>,
      keySelector: IndexedSelector<T, TKey>,
      equalityComparer?: EqualityComparer<TKey>
    ): Enumerable<GroupedIterable<TKey, T>>
  }
}

function groupBy<T, TKey>(
  this: Enumerable<T>,
  keySelector: IndexedSelector<T, TKey>,
  equalityComparer?: EqualityComparer<TKey>
): Enumerable<GroupedIterable<TKey, T>> {
  const lookup = this.toLookup(keySelector, equalityComparer)

  return lookup.select(([key, value]) => {
    const returnValue = new GroupedIterable(key, value)

    return returnValue
  })
}
Enumerable.prototype.groupBy = groupBy
