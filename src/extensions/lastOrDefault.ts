import { Enumerable } from '../Enumerable'
import { IndexedPredicate } from '../IndexedPredicate'

declare module '../Enumerable' {
  interface Enumerable<T> {
    lastOrDefault<T>(this: Enumerable<T>): T | undefined
    // tslint:disable-next-line:unified-signatures
    lastOrDefault<T>(this: Enumerable<T>, pred: IndexedPredicate<T>): T | undefined
  }
}

function lastOrDefault<T>(
  this: Enumerable<T>,
  pred: IndexedPredicate<T> = x => true
): T | undefined {
  let i = 0
  let returnVal
  for (const item of this) {
    if (pred(item, i++)) {
      returnVal = item
    }
  }
  return returnVal
}

Enumerable.prototype.lastOrDefault = lastOrDefault
