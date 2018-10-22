import { Enumerable } from '../Enumerable'
import { IndexedPredicate } from '../IndexedPredicate'

declare module '../Enumerable' {
  interface Enumerable<T> {
    firstOrDefault(this: Enumerable<T>): T | undefined
    // tslint:disable-next-line:unified-signatures
    firstOrDefault(this: Enumerable<T>, pred: IndexedPredicate<T>): T | undefined
  }
}

function firstOrDefault<T>(this: Enumerable<T>): T | undefined
function firstOrDefault<T>(
  this: Enumerable<T>,
  pred: IndexedPredicate<T> = () => true
): T | undefined {
  let i = 0
  for (const item of this) {
    if (pred(item, i++)) {
      return item
    }
  }
  return undefined
}

Enumerable.prototype.firstOrDefault = firstOrDefault
