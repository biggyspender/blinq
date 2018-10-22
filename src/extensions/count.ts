import { Enumerable } from '../Enumerable'
import { IndexedPredicate } from '../IndexedPredicate'

declare module '../Enumerable' {
  interface Enumerable<T> {
    count<T>(this: Enumerable<T>): number
    // tslint:disable-next-line:unified-signatures
    count<T>(this: Enumerable<T>, pred: IndexedPredicate<T>): number
  }
}

function count<T>(this: Enumerable<T>): number
function count<T>(this: Enumerable<T>, pred: IndexedPredicate<T> = x => true): number {
  let c = 0
  let i = 0
  for (const item of this) {
    if (pred(item, i++)) {
      ++c
    }
  }
  return c
}

Enumerable.prototype.count = count
