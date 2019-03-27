import { fromIterable as blinq } from '../EnumerableGenerators'
import { EqualityComparer } from '../comparer/EqualityComparer'
import { KeyValuePair } from './KeyValuePair'
import { HashTable } from './HashTable'
export const resize = <TKey, TValue>(
  count: number,
  buckets: Iterable<KeyValuePair<TKey, TValue>[]>,
  { equals, getHashCode }: EqualityComparer<TKey>,
  hashTableFactory: (cap: number, comparer: EqualityComparer<TKey>) => HashTable<TKey, TValue>
) => {
  const keyValuePairs = blinq(buckets)
    .where(b => b != null)
    .selectMany(b => b)
  const newHashTable = hashTableFactory(count, { equals, getHashCode })
  keyValuePairs.forEach(([k, v, i]) => newHashTable.add(k, v, i))
  return newHashTable.buckets
}
