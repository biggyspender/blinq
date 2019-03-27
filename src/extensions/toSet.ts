import { Enumerable } from '../Enumerable'
import SetIterable from '../SetIterable'
import { IndexedSelector } from '../IndexedSelector'
import getIdentity from '../getIdentity'
import { isEqualityComparer, EqualityComparer } from '../comparer/EqualityComparer'
import { isIndexedSelector } from './isIndexedSelector'
import { createComparerSet } from '../createComparerSet'

declare module '../Enumerable' {
  interface Enumerable<T> {
    toSet<T>(this: Enumerable<T>, equalityComparer?: EqualityComparer<T>): SetIterable<T>
    toSet<T, TKey>(
      this: Enumerable<T>,
      keySelector: IndexedSelector<T, TKey>,
      equalityComparer?: EqualityComparer<TKey>
    ): SetIterable<TKey>
  }
}
function toSet<T>(this: Enumerable<T>, equalityComparer?: EqualityComparer<T>): SetIterable<T>
function toSet<T, TKey>(
  this: Enumerable<T>,
  keySelector: IndexedSelector<T, TKey>,
  equalityComparer?: EqualityComparer<TKey>
): SetIterable<TKey>
function toSet<T, TKey = T>(
  this: Enumerable<T>,
  keySelectorOrEqualityComparer?: IndexedSelector<T, TKey> | EqualityComparer<TKey>,
  equalityComparer?: EqualityComparer<TKey>
): SetIterable<TKey> {
  const ks: IndexedSelector<T, TKey> = (isIndexedSelector(keySelectorOrEqualityComparer)
    ? keySelectorOrEqualityComparer
    : getIdentity()) as IndexedSelector<T, TKey>
  const eqCom = isEqualityComparer(keySelectorOrEqualityComparer)
    ? keySelectorOrEqualityComparer
    : equalityComparer
  const set = createComparerSet<TKey>(0, eqCom)
  let i = 0
  for (const x of this) {
    const key = ks(x, i++)
    if (set.has(key)) {
      throw Error('duplicate key')
    }
    set.add(key)
  }
  return new SetIterable(set)
}
Enumerable.prototype.toSet = toSet
