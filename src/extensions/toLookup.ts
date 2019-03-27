import { Enumerable } from '../Enumerable'
import MapIterable from '../MapIterable'
import ArrayIterable from '../ArrayIterable'
import { IndexedSelector } from '../IndexedSelector'
import { createComparerMap } from '../createComparerMap'
import { EqualityComparer } from '../blinq'
import { isEqualityComparer } from '../comparer/EqualityComparer'
// import { Enumerable, IndexedSelector, getIdentity } from "../Enumerable"
// const identity = getIdentity();

declare module '../Enumerable' {
  interface Enumerable<T> {
    toLookup<T, TKey>(
      this: Enumerable<T>,
      keySelector: IndexedSelector<T, TKey>,
      equalityComparer?: EqualityComparer<TKey>
    ): MapIterable<TKey, Enumerable<T>>
    toLookup<T, TKey, TValue>(
      this: Enumerable<T>,
      keySelector: IndexedSelector<T, TKey>,
      valueSelector: IndexedSelector<T, TValue>,
      equalityComparer?: EqualityComparer<TKey>
    ): MapIterable<TKey, Enumerable<TValue>>
  }
}

const isValueSelector = <T, TValue>(obj: any): obj is IndexedSelector<T, TValue> =>
  typeof obj === 'function'

function toLookup<T, TKey>(
  this: Enumerable<T>,
  keySelector: IndexedSelector<T, TKey>,
  equalityComparer?: EqualityComparer<TKey>
): MapIterable<TKey, Enumerable<T>>
function toLookup<T, TKey, TValue>(
  this: Enumerable<T>,
  keySelector: IndexedSelector<T, TKey>,
  valueSelector: IndexedSelector<T, TValue>,
  equalityComparer?: EqualityComparer<TKey>
): MapIterable<TKey, Enumerable<TValue>>
function toLookup<T, TKey, TValue>(
  this: Enumerable<T>,
  keySelector: IndexedSelector<T, TKey>,
  valueSelectorOrEqualityComparer?: IndexedSelector<T, TValue> | EqualityComparer<TKey>,
  equalityComparer?: EqualityComparer<TKey>
): MapIterable<TKey, Enumerable<T | TValue>> {
  let comparer: EqualityComparer<TKey> | undefined
  let valueSelector: IndexedSelector<T, TValue> | undefined
  if (isEqualityComparer(valueSelectorOrEqualityComparer)) {
    comparer = valueSelectorOrEqualityComparer
  } else {
    comparer = equalityComparer
    if (isValueSelector<T, TValue>(valueSelectorOrEqualityComparer)) {
      valueSelector = valueSelectorOrEqualityComparer
    }
  }

  const vs: (v: T, i: number) => T | TValue = valueSelector || (x => x)

  const map: Map<TKey, ArrayIterable<T | TValue>> = createComparerMap(0, comparer)
  let i = 0
  for (const item of this) {
    let currentIdx = i++
    const key = keySelector(item, currentIdx)
    let arr: ArrayIterable<T | TValue>

    arr = map.get(key) || new ArrayIterable<T | TValue>([])
    map.set(key, arr)
    arr.push(vs(item, currentIdx))
  }
  return new MapIterable<TKey, Enumerable<T | TValue>>(map)
}
Enumerable.prototype.toLookup = toLookup
