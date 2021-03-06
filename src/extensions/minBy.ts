import { Enumerable } from '../Enumerable'
import { Comparer } from '../Comparer'
import { IndexedSelector } from '../IndexedSelector'
import minMaxByImpl from './helpers/minMaxByImpl'
import getDefaultComparer from '../getDefaultComparer'

const defaultComparer = getDefaultComparer()

declare module '../Enumerable' {
  interface Enumerable<T> {
    minBy<T, TKey>(this: Enumerable<T>, selector: IndexedSelector<T, TKey>): Enumerable<T>
    minBy<T, TKey>(
      this: Enumerable<T>,
      selector: IndexedSelector<T, TKey>,
      // tslint:disable-next-line:unified-signatures
      comparer: Comparer<TKey>
    ): Enumerable<T>
  }
}

function minBy<T, TKey>(this: Enumerable<T>, selector: IndexedSelector<T, TKey>): Enumerable<T>
function minBy<T, TKey>(
  this: Enumerable<T>,
  selector: IndexedSelector<T, TKey>,
  comparer: Comparer<TKey> = defaultComparer
): Enumerable<T> {
  return minMaxByImpl(this, selector, (a, b) => -comparer(a, b))
}

Enumerable.prototype.minBy = minBy
