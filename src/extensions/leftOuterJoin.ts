import { Enumerable, IndexedSelector } from '../Enumerable'
import './defaultIfEmpty'
declare module '../Enumerable' {
  interface Enumerable<T> {
    leftOuterJoin<T, TInner, TKey, TOut>(
      this: Enumerable<T>,
      innerSeq: Iterable<TInner>,
      outerKeySelector: IndexedSelector<T, TKey>,
      innerKeySelector: IndexedSelector<TInner, TKey>,
      selector: (outer: T, inner: TInner | undefined) => TOut
    ): Enumerable<TOut>
  }
}

// <T>(this:Enumerable<T>,
function leftOuterJoin<T, TInner, TKey, TOut>(
  this: Enumerable<T>,
  innerSeq: Iterable<TInner>,
  outerKeySelector: IndexedSelector<T, TKey>,
  innerKeySelector: IndexedSelector<TInner, TKey>,
  selector: (outer: T, inner: TInner | undefined) => TOut
): Enumerable<TOut> {
  return this.groupJoin(innerSeq, outerKeySelector, innerKeySelector, (outer, innerSeq) => ({
    outer,
    innerSeq
  })).selectMany(({ outer, innerSeq }) => innerSeq.defaultIfEmpty().select(i => selector(outer, i)))
}
Enumerable.prototype.leftOuterJoin = leftOuterJoin
