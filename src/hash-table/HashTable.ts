import { blinq } from '../blinq'
import { EqualityComparer } from '../comparer/EqualityComparer'
import { KeyValuePair } from './KeyValuePair'
import { getBucket } from './getBucket'
import { resize } from './resize'
import { createHashTable } from './createHashTable'
export class HashTable<TKey, TValue> implements Map<TKey, TValue> {
  buckets: KeyValuePair<TKey, TValue>[][]
  count: number
  avgBucketFill: number
  comparer: EqualityComparer<TKey>
  insertCount: number
  initialCapacity: number
  constructor(
    buckets: KeyValuePair<TKey, TValue>[][],
    count: number,
    avgBucketFill: number,
    initialCapacity: number,
    comparer: EqualityComparer<TKey>
  ) {
    this.buckets = buckets
    this.count = count
    this.avgBucketFill = avgBucketFill
    this.comparer = comparer
    this.insertCount = 0
    this.initialCapacity = initialCapacity
  }
  [Symbol.iterator]() {
    return this.entries()
  }
  entries(): IterableIterator<[TKey, TValue]> {
    const r = [
      ...blinq(this.buckets)
        .selectMany(x => x)
        .orderBy(([, , i]) => i)
        .select<KeyValuePair<TKey, TValue>, [TKey, TValue]>(([k, v]) => [k, v])
    ]
    return r[Symbol.iterator]()
  }
  keys(): IterableIterator<TKey> {
    const r = [...blinq(this.entries()).select(([k]) => k)]
    return r[Symbol.iterator]()
  }
  values(): IterableIterator<TValue> {
    const r = [...blinq(this.entries()).select(([, v]) => v)]
    return r[Symbol.iterator]()
  }
  clear() {
    const buckets = createHashTable<TKey, TValue>(this.initialCapacity, this.comparer).buckets
    this.buckets = buckets
    this.count = 0
    this.insertCount = 0
  }
  delete(key: TKey) {
    const bucket = getBucket(key, this.buckets, this.comparer)
    if (bucket == null) {
      return false
    }
    const idx = blinq(bucket)
      .select(([k, v], i) => ({ k, v, i }))
      .where(({ k }) => this.comparer.equals(k, key))
      .select(({ i }) => i)
      .singleOrDefault()
    if (idx == null) {
      return false
    }
    bucket.splice(idx, 1)
    --this.count
    return true
  }
  forEach(callbackfn: (value: TValue, key: TKey, map: Map<TKey, TValue>) => void, thisArg?: any) {
    const cb = thisArg ? callbackfn.bind(thisArg) : callbackfn
    blinq(this.entries()).forEach(([k, v]) => cb(v, k, this))
  }
  set(key: TKey, value: TValue) {
    this.add(key, value)
    return this
  }
  has(key: TKey) {
    const bucket = getBucket(key, this.buckets, this.comparer)
    if (bucket == null) {
      return false
    }
    return blinq(bucket).any(([k]) => this.comparer.equals(k, key))
  }
  get size() {
    return this.count
  }
  add(key: TKey, value: TValue, insertIndex?: number) {
    const idealNumBuckets = (this.count / this.avgBucketFill) | 0
    if (idealNumBuckets >= this.buckets.length) {
      this.buckets = resize(this.count * 2, this.buckets, this.comparer)
    }
    const bucket = getBucket(key, this.buckets, this.comparer, true)!
    const keyExists = !bucket.every(([bkey]) => !this.comparer.equals(key, bkey))
    if (keyExists) {
      return false
    }
    this.count++
    bucket.push([key, value, insertIndex == null ? this.insertCount++ : insertIndex])
    return true
  }
  get(key: TKey) {
    const bucket = getBucket(key, this.buckets, this.comparer)
    return bucket
      ? blinq(bucket)
          .where(([k]) => this.comparer.equals(k, key))
          .select(([, v]) => v)
          .firstOrDefault()
      : undefined
  }
  [Symbol.toStringTag]: 'foo'
  /* istanbul ignore next */
  toString() {
    const counts = blinq(this.buckets).select(b => (b ? b.length : 0))
    const avgBucketFill = counts.average()
    return JSON.stringify({ counts: [...counts].join(','), avgBucketFill }, null, 2)
  }
}
