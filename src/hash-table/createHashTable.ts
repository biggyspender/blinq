import { EqualityComparer } from '../comparer/EqualityComparer'
import { KeyValuePair } from './KeyValuePair'
import { initializeArrayForCapacity } from './initializeArrayForCapacity'
import { HashTable } from './HashTable'
export const createHashTable = <TKey, TValue>(
  capacity: number,
  comparer: EqualityComparer<TKey>
): HashTable<TKey, TValue> => {
  let count = 0
  const avgBucketFill = 2
  const idealNumBuckets = (capacity / avgBucketFill) | 0
  let buckets: KeyValuePair<TKey, TValue>[][] = initializeArrayForCapacity<
    KeyValuePair<TKey, TValue>[]
  >(idealNumBuckets)
  return new HashTable<TKey, TValue>(buckets, count, avgBucketFill, capacity, comparer)
}
