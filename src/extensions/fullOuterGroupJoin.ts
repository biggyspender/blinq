import { Enumerable, IndexedSelector, getIdentity } from '../Enumerable'

declare module '../Enumerable' {
  interface Enumerable<T> {
    fullOuterGroupJoin<T, TRight, TKey, TOut>(
      this: Enumerable<T>,
      rightSeq: Iterable<TRight>,
      leftKeySelector: IndexedSelector<T, TKey>,
      rightKeySelector: IndexedSelector<TRight, TKey>,
      selector: (o: Enumerable<T>, v: Enumerable<TRight>, k: TKey) => TOut
    ): Enumerable<TOut>
  }
}

const identity = getIdentity()

function fullOuterGroupJoin<T, TRight, TKey, TOut>(
  this: Enumerable<T>,
  rightSeq: Iterable<TRight>,
  leftKeySelector: IndexedSelector<T, TKey>,
  rightKeySelector: IndexedSelector<TRight, TKey>,
  selector: (o: Enumerable<T>, v: Enumerable<TRight>, k: TKey) => TOut
): Enumerable<TOut> {
  const right = Enumerable.fromIterable(rightSeq)
  const leftLookup = this.toLookup(leftKeySelector)
  const rightLookup = right.toLookup(rightKeySelector)
  const allKeys = leftLookup
    .select(([key, _]) => key)
    .concat(rightLookup.select(([key, _]) => key))
    .distinct()
  return allKeys
    .select(key => ({ key, leftItem: leftLookup.get(key) || Enumerable.empty<T>() }))
    .select(({ key, leftItem }) => ({
      key,
      leftItem,
      rightItem: rightLookup.get(key) || Enumerable.empty<TRight>()
    }))
    .select(x => selector(x.leftItem, x.rightItem, x.key))
}

Enumerable.prototype.fullOuterGroupJoin = fullOuterGroupJoin
