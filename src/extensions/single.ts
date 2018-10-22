import { Enumerable } from '../Enumerable'
import { IndexedPredicate } from '../IndexedPredicate'

declare module '../Enumerable' {
  interface Enumerable<T> {
    single<T>(this: Enumerable<T>): T
    // tslint:disable-next-line:unified-signatures
    single<T>(this: Enumerable<T>, pred: IndexedPredicate<T>): T
  }
}

// <T>(this:Enumerable<T>,
function single<T>(this: Enumerable<T>, pred: IndexedPredicate<T> = x => true): T {
  let itemCount = 0
  let foundItem
  let i = 0
  for (const item of this) {
    if (pred(item, i++)) {
      ++itemCount
      if (itemCount > 1) {
        throw Error('sequence contains more than one element')
      }
      foundItem = item
    }
  }
  if (itemCount === 1) {
    /* istanbul ignore next */
    if (foundItem) {
      return foundItem
    }
  }
  throw Error('sequence contains no elements')
}

Enumerable.prototype.single = single
