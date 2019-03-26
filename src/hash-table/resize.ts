import { blinq } from '../blinq'
import { EqualityComparer } from '../comparer/EqualityComparer'
import { KeyValuePair } from './KeyValuePair'
import { createHashTable } from './createHashTable'
export const resize = <TKey, TValue>(
  count: number,
  buckets: Iterable<KeyValuePair<TKey, TValue>[]>,
  { equals, getHashCode }: EqualityComparer<TKey>
) => {
  const keyValuePairs = blinq(buckets)
    .where(b => b != null)
    .selectMany(b => b)
  const newHashTable = createHashTable<TKey, TValue>(count, { equals, getHashCode })
  keyValuePairs.forEach(([k, v, i]) => newHashTable.add(k, v, i))
  return newHashTable.buckets
}
