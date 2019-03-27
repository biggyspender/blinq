import { EqualityComparer } from './comparer/EqualityComparer'
import { createHashTable } from './hash-table/createHashTable'
export const createComparerSet = <K>(
  capacity: number = 0,
  comparer?: EqualityComparer<K>
): Set<K> => {
  if (!comparer) {
    return new Set<K>()
  }
  const ht = createHashTable<K, K>(capacity, comparer)
  return toSet(ht)
}
const toSet = <K>(map: Map<K, K>): Set<K> => {
  const set: Set<K> = {
    add(v: K) {
      map.set(v, v)
      return set
    },
    clear() {
      map.clear()
    },
    delete(k: K) {
      return map.delete(k)
    },
    entries() {
      return map.entries()
    },
    forEach(cb: (k1: K, k2: K, s: Set<K>) => void) {
      return map.forEach((v, k) => cb(v, k, set))
    },
    has(v: K) {
      return map.has(v)
    },
    keys() {
      return map.keys()
    },
    get size() {
      return map.size
    },
    values() {
      return map.values()
    },
    [Symbol.iterator]() {
      return set.keys()
    },
    [Symbol.toStringTag]: 'Set'
  }
  return set
}
