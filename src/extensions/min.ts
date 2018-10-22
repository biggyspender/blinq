import { Enumerable } from '../Enumerable'
import { IndexedSelector } from '../IndexedSelector'
import { Comparer } from '../Comparer'
import minMaxByImpl from './helpers/minMaxByImpl'
import getIdentity from '../getIdentity'
import getDefaultComparer from '../getDefaultComparer'

import './firstOrDefault'

const identity = getIdentity()

declare module '../Enumerable' {
  interface Enumerable<T> {
    min(): T | undefined
    min<TOut>(selector: IndexedSelector<T, TOut>): TOut | undefined
    // tslint:disable-next-line:unified-signatures
    min<TOut>(selector: IndexedSelector<T, TOut>, comparer: Comparer<TOut>): TOut | undefined
    min<TOut>(
      this: Enumerable<T>,
      selector: IndexedSelector<T, T | TOut>,
      comparer: Comparer<T | TOut>
    ): T | TOut | undefined
  }
}

const defaultComparer = getDefaultComparer()

function min<T>(): T | undefined
function min<T, TOut>(selector: IndexedSelector<T, TOut>): TOut | undefined
// tslint:disable-next-line:unified-signatures
function min<T, TOut>(
  selector: IndexedSelector<T, TOut>,
  // tslint:disable-next-line:unified-signatures
  comparer: Comparer<TOut>
): TOut | undefined
function min<T, TOut>(
  this: Enumerable<T>,
  selector: IndexedSelector<T, T | TOut> = identity,
  comparer: Comparer<T | TOut> = defaultComparer
): T | TOut | undefined {
  return minMaxByImpl(this.select(selector), x => x, (a, b) => -comparer(a, b)).firstOrDefault()
}

Enumerable.prototype.min = min
