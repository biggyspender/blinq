import { Enumerable } from '../Enumerable'
import { IndexedPredicate } from '../IndexedPredicate'

declare module '../Enumerable' {
  interface Enumerable<T> {
    single<T>(this: Enumerable<T>): T
    // tslint:disable-next-line:unified-signatures
    single<T>(this: Enumerable<T>, pred: IndexedPredicate<T>): T
  }
}

const dummy: any = {}

function single<T>(this: Enumerable<T>, pred: IndexedPredicate<T> = x => true): T {
  let itemCount = 0
  let foundItem = dummy
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
    return foundItem
  }
  throw Error('sequence contains no elements')
}

Enumerable.prototype.single = single
