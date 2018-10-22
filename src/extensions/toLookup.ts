import { Enumerable } from '../Enumerable'
import MapIterable from '../MapIterable'
import ArrayIterable from '../ArrayIterable'
import { IndexedSelector } from '../IndexedSelector'
// import { Enumerable, IndexedSelector, getIdentity } from "../Enumerable"
// const identity = getIdentity();

declare module '../Enumerable' {
  interface Enumerable<T> {
    toLookup<T, TKey>(
      this: Enumerable<T>,
      keySelector: IndexedSelector<T, TKey>
    ): MapIterable<TKey, Enumerable<T>>
    toLookup<T, TKey, TValue>(
      this: Enumerable<T>,
      keySelector: IndexedSelector<T, TKey>,
      valueSelector: IndexedSelector<T, TValue>
    ): MapIterable<TKey, Enumerable<TValue>>
  }
}

function toLookup<T, TKey>(
  this: Enumerable<T>,
  keySelector: IndexedSelector<T, TKey>
): MapIterable<TKey, Enumerable<T>>
function toLookup<T, TKey, TValue>(
  this: Enumerable<T>,
  keySelector: IndexedSelector<T, TKey>,
  valueSelector: IndexedSelector<T, TValue>
): MapIterable<TKey, Enumerable<TValue>>
function toLookup<T, TKey, TValue>(
  this: Enumerable<T>,
  keySelector: IndexedSelector<T, TKey>,
  valueSelector?: IndexedSelector<T, TValue>
): MapIterable<TKey, Enumerable<T | TValue>> {
  const vs: (v: T, i: number) => T | TValue = valueSelector || (x => x)

  const map: Map<TKey, ArrayIterable<T | TValue>> = new Map()
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
