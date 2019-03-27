import { Enumerable } from '../Enumerable'
import MapIterable from '../MapIterable'
import { IndexedSelector } from '../IndexedSelector'
import { EqualityComparer } from '../blinq'
import { createComparerMap } from '../createComparerMap'

declare module '../Enumerable' {
  interface Enumerable<T> {
    toMap<T, TKey, TValue>(
      this: Enumerable<T>,
      keySelector: IndexedSelector<T, TKey>,
      valueSelector: IndexedSelector<T, TValue>,
      equalityComparer?: EqualityComparer<TKey>
    ): MapIterable<TKey, TValue>
  }
}

function toMap<T, TKey, TValue>(
  this: Enumerable<T>,
  keySelector: IndexedSelector<T, TKey>,
  valueSelector: IndexedSelector<T, TValue>,
  equalityComparer?: EqualityComparer<TKey>
): MapIterable<TKey, TValue> {
  const map = createComparerMap<TKey, TValue>(0, equalityComparer)
  let i = 0
  for (const x of this) {
    const key = keySelector(x, i)
    if (map.has(key)) {
      throw Error('duplicate key')
    }
    map.set(key, valueSelector(x, i))
  }
  return new MapIterable(map)
}
Enumerable.prototype.toMap = toMap
