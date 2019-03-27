import { Enumerable } from '../Enumerable'
import { IndexedSelector } from '../IndexedSelector'
import { EqualityComparer } from '../blinq'

declare module '../Enumerable' {
  interface Enumerable<T> {
    join<T, TInner, TKey, TOut>(
      this: Enumerable<T>,
      innerSeq: Iterable<TInner>,
      outerKeySelector: IndexedSelector<T, TKey>,
      innerKeySelector: IndexedSelector<TInner, TKey>,
      selector: (outer: T, inner: TInner) => TOut,
      equalityComparer?: EqualityComparer<TKey>
    ): Enumerable<TOut>
  }
}

function join<T, TInner, TKey, TOut>(
  this: Enumerable<T>,
  innerSeq: Iterable<TInner>,
  outerKeySelector: IndexedSelector<T, TKey>,
  innerKeySelector: IndexedSelector<TInner, TKey>,
  selector: (outer: T, inner: TInner) => TOut,
  equalityComparer?: EqualityComparer<TKey>
): Enumerable<TOut> {
  return this.groupJoin(
    innerSeq,
    outerKeySelector,
    innerKeySelector,
    (outer, innerSeq) => ({
      outer,
      innerSeq
    }),
    equalityComparer
  ).selectMany(({ outer, innerSeq }) => innerSeq.select(i => selector(outer, i)))
}
Enumerable.prototype.join = join
