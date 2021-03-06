import { Enumerable } from '../Enumerable'
import { IndexedSelector } from '../IndexedSelector'

import getIdentity from '../getIdentity'
import './fullOuterGroupJoin'
import './defaultIfEmpty'
import { EqualityComparer } from '../blinq'

declare module '../Enumerable' {
  interface Enumerable<T> {
    fullOuterJoin<TRight, TKey, TOut>(
      this: Enumerable<T>,
      rightSeq: Iterable<TRight>,
      leftKeySelector: IndexedSelector<T, TKey>,
      rightKeySelector: IndexedSelector<TRight, TKey>,
      selector: (o: T | undefined, v: TRight | undefined, k: TKey) => TOut,
      equalityComparer?: EqualityComparer<TKey>
    ): Enumerable<TOut>
  }
}

const identity = getIdentity()

function fullOuterJoin<T, TRight, TKey, TOut>(
  this: Enumerable<T>,
  rightSeq: Iterable<TRight>,
  leftKeySelector: IndexedSelector<T, TKey>,
  rightKeySelector: IndexedSelector<TRight, TKey>,
  selector: (o: T | undefined, v: TRight | undefined, k: TKey) => TOut,
  equalityComparer?: EqualityComparer<TKey>
): Enumerable<TOut> {
  return this.fullOuterGroupJoin(
    rightSeq,
    leftKeySelector,
    rightKeySelector,
    (lft, rgt, i) =>
      lft.defaultIfEmpty().selectMany(l => rgt.defaultIfEmpty().select(r => selector(l, r, i))),
    equalityComparer
  ).selectMany(identity)
}

Enumerable.prototype.fullOuterJoin = fullOuterJoin
