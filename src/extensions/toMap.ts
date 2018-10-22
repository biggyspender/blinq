import { Enumerable, IndexedSelector } from '../Enumerable'
import MapIterable from '../MapIterable'

declare module '../Enumerable' {
  interface Enumerable<T> {
    toMap<T, TKey, TValue>(
      this: Enumerable<T>,
      keySelector: IndexedSelector<T, TKey>,
      valueSelector: IndexedSelector<T, TValue>
    ): MapIterable<TKey, TValue>
  }
}

function toMap<T, TKey, TValue>(
  this: Enumerable<T>,
  keySelector: IndexedSelector<T, TKey>,
  valueSelector: IndexedSelector<T, TValue>
): MapIterable<TKey, TValue> {
  const map = new Map<TKey, TValue>()
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
