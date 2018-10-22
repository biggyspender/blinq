import { Enumerable, IndexedSelector } from '../../Enumerable'
import { Comparer } from '../../Comparer'
import * as EnumerableGenerators from '../../EnumerableGenerators'

export default function minMaxByImpl<T, TKey>(
  src: Iterable<T>,
  selector: IndexedSelector<T, TKey>,
  comparer: Comparer<TKey>
): Enumerable<T> {
  let currentBestKey: TKey | undefined
  let currentBest: T[] = []
  let i = 0
  for (const item of src) {
    const idx = i++
    const key = selector(item, idx)
    if (typeof currentBestKey === 'undefined') {
      currentBest.push(item)
      currentBestKey = key
    } else {
      const comparison = comparer(key, currentBestKey)
      if (comparison > 0) {
        currentBest = [item]
        currentBestKey = key
      } else if (comparison === 0) {
        currentBest.push(item)
      }
    }
  }
  if (currentBest.length === 0) {
    throw Error('sequence contains no elements')
  }

  return EnumerableGenerators.fromIterable(currentBest)
}
