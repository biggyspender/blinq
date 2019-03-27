import { Enumerable } from '../Enumerable'
import MapIterable from '../MapIterable'
import { IndexedSelector } from '../IndexedSelector'
import { EqualityComparer } from '../blinq'
import { createComparerMap } from '../createComparerMap'
import { isIndexedSelector } from './isIndexedSelector'
import { isEqualityComparer } from '../comparer/EqualityComparer'
import getIdentity from '../getIdentity'

declare module '../Enumerable' {
  interface Enumerable<T> {
    toMap<T, TKey>(
      this: Enumerable<T>,
      keySelector: IndexedSelector<T, TKey>,
      equalityComparer?: EqualityComparer<TKey>
    ): MapIterable<TKey, T>
    toMap<T, TKey, TValue>(
      this: Enumerable<T>,
      keySelector: IndexedSelector<T, TKey>,
      valueSelector: IndexedSelector<T, TValue>,
      equalityComparer?: EqualityComparer<TKey>
    ): MapIterable<TKey, TValue>
  }
}
function toMap<T, TKey>(
  this: Enumerable<T>,
  keySelector: IndexedSelector<T, TKey>,
  equalityComparer?: EqualityComparer<TKey>
): MapIterable<TKey, T>
function toMap<T, TKey, TValue>(
  this: Enumerable<T>,
  keySelector: IndexedSelector<T, TKey>,
  valueSelector: IndexedSelector<T, TValue>,
  equalityComparer?: EqualityComparer<TKey>
): MapIterable<TKey, TValue>
function toMap<T, TKey, TValue = T>(
  this: Enumerable<T>,
  keySelector: IndexedSelector<T, TKey>,
  valueSelectorOrEqualityComparer?: IndexedSelector<T, TValue> | EqualityComparer<TKey>,
  equalityComparer?: EqualityComparer<TKey>
): MapIterable<TKey, TValue> {
  const vs: any = isIndexedSelector(valueSelectorOrEqualityComparer)
    ? valueSelectorOrEqualityComparer
    : getIdentity()
  const eqCom = isEqualityComparer(valueSelectorOrEqualityComparer)
    ? valueSelectorOrEqualityComparer
    : equalityComparer

  const map = createComparerMap<TKey, TValue>(0, eqCom)
  let i = 0
  for (const x of this) {
    const key = keySelector(x, i++)
    if (map.has(key)) {
      throw Error('duplicate key')
    }
    map.set(key, vs(x, i) as any)
  }
  return new MapIterable(map)
}
Enumerable.prototype.toMap = toMap
