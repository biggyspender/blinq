import { Enumerable } from '../Enumerable'
import OrderedIterable from '../OrderedIterable'
import { ComparerBuilder } from '../ComparerBuilder'
declare module '../Enumerable' {
  interface Enumerable<T> {
    orderByDescending<TCmp>(this: Enumerable<T>, selector: (x: T) => TCmp): OrderedIterable<T>
  }
}

// <T>(this:Enumerable<T>,
function orderByDescending<T, TCmp>(
  this: Enumerable<T>,
  selector: (x: T) => TCmp
): OrderedIterable<T> {
  const builder = ComparerBuilder.create<T>().sortKeyDescending(selector)
  return new OrderedIterable<T>(this, builder)
}
Enumerable.prototype.orderByDescending = orderByDescending
