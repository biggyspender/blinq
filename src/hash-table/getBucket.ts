import { EqualityComparer } from '../comparer/EqualityComparer'
import { mod } from '../util/mod'
import { KeyValuePair } from './KeyValuePair'
export const getBucket = <TKey, TValue>(
  key: TKey,
  buckets: KeyValuePair<TKey, TValue>[][],
  { getHashCode }: EqualityComparer<TKey>,
  create: boolean = false
) => {
  const h = getHashCode(key)
  const bucketIndex = mod(h, buckets.length)
  const bucket = buckets[bucketIndex]
  return bucket ? bucket : create ? (buckets[bucketIndex] = []) : null
}
