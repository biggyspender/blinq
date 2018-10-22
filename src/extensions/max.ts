import { Enumerable, IndexedSelector, getDefaultComparer } from '../Enumerable'
import { Comparer } from '../Comparer'
import minMaxByImpl from './helpers/minMaxByImpl'
import getIdentity from '../getIdentity'
import './firstOrDefault'

const identity = getIdentity()

declare module '../Enumerable' {
  interface Enumerable<T> {
    max(): T | undefined
    max<TOut>(selector: IndexedSelector<T, TOut>): TOut | undefined
    // tslint:disable-next-line:unified-signatures
    max<TOut>(selector: IndexedSelector<T, TOut>, comparer: Comparer<TOut>): TOut | undefined
    max<TOut>(
      this: Enumerable<T>,
      selector: IndexedSelector<T, T | TOut>,
      comparer: Comparer<T | TOut>
    ): T | TOut | undefined
  }
}

const defaultComparer = getDefaultComparer()

function max<T>(): T | undefined
function max<T, TOut>(selector: IndexedSelector<T, TOut>): TOut | undefined
// tslint:disable-next-line:unified-signatures
function max<T, TOut>(
  selector: IndexedSelector<T, TOut>,
  // tslint:disable-next-line:unified-signatures
  comparer: Comparer<TOut>
): TOut | undefined
function max<T, TOut>(
  this: Enumerable<T>,
  selector: IndexedSelector<T, T | TOut> = identity,
  comparer: Comparer<T | TOut> = defaultComparer
): T | TOut | undefined {
  return minMaxByImpl(this.select(selector), x => x, comparer).firstOrDefault()
}

Enumerable.prototype.max = max
