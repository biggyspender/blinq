import { Enumerable } from '../Enumerable'
import { IndexedPredicate } from '../IndexedPredicate'

declare module '../Enumerable' {
  interface Enumerable<T> {
    last<T>(this: Enumerable<T>): T
    // tslint:disable-next-line:unified-signatures
    last<T>(this: Enumerable<T>, pred: IndexedPredicate<T>): T
  }
}

function last<T>(this: Enumerable<T>, pred: IndexedPredicate<T> = x => true): T {
  let i = 0
  let returnVal
  let found = false
  for (const item of this) {
    if (pred(item, i++)) {
      returnVal = item
      found = true
    }
  }
  if (found && returnVal) {
    return returnVal
  } else {
    throw Error('sequence contains no elements')
  }
}
Enumerable.prototype.last = last
