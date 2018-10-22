import { Enumerable, IndexedSelector, getIdentity } from '../Enumerable'
import * as EnumerableGenerators from '../EnumerableGenerators'
declare module '../Enumerable' {
  interface Enumerable<T> {
    distinctBy<T, TKey>(this: Enumerable<T>, selector: IndexedSelector<T, TKey>): Enumerable<T>
  }
}

function distinctBy<T, TKey>(
  this: Enumerable<T>,
  selector: IndexedSelector<T, TKey>
): Enumerable<T> {
  const src = this
  return EnumerableGenerators.fromGenerator(function*() {
    const set = new Set<TKey>()
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
