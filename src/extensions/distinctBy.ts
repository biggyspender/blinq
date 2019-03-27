import { Enumerable } from '../Enumerable'
import { IndexedSelector } from '../IndexedSelector'
import * as EnumerableGenerators from '../EnumerableGenerators'
import { EqualityComparer } from '../comparer/EqualityComparer'
import { createComparerSet } from '../createComparerSet'
declare module '../Enumerable' {
  interface Enumerable<T> {
    distinctBy<T, TKey>(
      this: Enumerable<T>,
      selector: IndexedSelector<T, TKey>,
      equalityComparer?: EqualityComparer<TKey>
    ): Enumerable<T>
  }
}

function distinctBy<T, TKey>(
  this: Enumerable<T>,
  selector: IndexedSelector<T, TKey>,
  equalityComparer?: EqualityComparer<TKey>
): Enumerable<T> {
  const src = this
  return EnumerableGenerators.fromGenerator(function*() {
    const set = createComparerSet<TKey>(0, equalityComparer)
    let i = 0
    for (const x of src) {
      const idx = i++
      const key = selector(x, idx)
      if (set.has(key)) {
        continue
      }
      set.add(key)
      yield x
    }
  })
}

Enumerable.prototype.distinctBy = distinctBy
