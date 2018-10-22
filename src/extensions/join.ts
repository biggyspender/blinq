import { Enumerable, IndexedSelector, getIdentity } from '../Enumerable'
const identity = getIdentity()

declare module '../Enumerable' {
  interface Enumerable<T> {
    join<T, TInner, TKey, TOut>(
      this: Enumerable<T>,
      innerSeq: Iterable<TInner>,
      outerKeySelector: IndexedSelector<T, TKey>,
      innerKeySelector: IndexedSelector<TInner, TKey>,
      selector: (outer: T, inner: TInner) => TOut
    ): Enumerable<TOut>
  }
}

function join<T, TInner, TKey, TOut>(
  this: Enumerable<T>,
  innerSeq: Iterable<TInner>,
  outerKeySelector: IndexedSelector<T, TKey>,
  innerKeySelector: IndexedSelector<TInner, TKey>,
  selector: (outer: T, inner: TInner) => TOut
): Enumerable<TOut> {
  return this.groupJoin(innerSeq, outerKeySelector, innerKeySelector, (outer, innerSeq) => ({
    outer,
    innerSeq
  })).selectMany(({ outer, innerSeq }) => innerSeq.select(i => selector(outer, i)))
}
Enumerable.prototype.join = join
