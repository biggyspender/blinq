import { Enumerable } from '../Enumerable'
import { IndexedPredicate } from '../IndexedPredicate'

declare module '../Enumerable' {
  interface Enumerable<T> {
    singleOrDefault<T>(this: Enumerable<T>): T | undefined
    // tslint:disable-next-line:unified-signatures
    singleOrDefault<T>(this: Enumerable<T>, pred: IndexedPredicate<T>): T | undefined
  }
}

//
function singleOrDefault<T>(
  this: Enumerable<T>,
  pred: IndexedPredicate<T> = x => true
): T | undefined {
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
    // ReSharper disable once UsageOfPossiblyUnassignedValue
    return foundItem
  }
  return undefined
}
Enumerable.prototype.singleOrDefault = singleOrDefault
