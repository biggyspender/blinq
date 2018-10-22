import { Enumerable } from '../Enumerable'
import { IndexedPredicate } from '../IndexedPredicate'

declare module '../Enumerable' {
  interface Enumerable<T> {
    first<T>(this: Enumerable<T>): T
    // tslint:disable-next-line:unified-signatures
    first<T>(this: Enumerable<T>, pred: IndexedPredicate<T>): T
  }
}

function first<T>(this: Enumerable<T>): T
function first<T>(this: Enumerable<T>, pred: IndexedPredicate<T> = x => true): T {
  let i = 0
  for (const item of this) {
    if (pred(item, i++)) {
      return item
    }
  }
  throw Error('sequence contains no elements')
}

Enumerable.prototype.first = first
