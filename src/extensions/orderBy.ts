import { Enumerable } from '../Enumerable'
import OrderedIterable from '../OrderedIterable'
import { ComparerBuilder } from '../ComparerBuilder'
declare module '../Enumerable' {
  interface Enumerable<T> {
    orderBy<TCmp>(this: Enumerable<T>, selector: (x: T) => TCmp): OrderedIterable<T>
  }
}

function orderBy<T, TCmp>(this: Enumerable<T>, selector: (x: T) => TCmp): OrderedIterable<T> {
  const builder = ComparerBuilder.create<T>().sortKey(selector)
  return new OrderedIterable<T>(this, builder)
}
Enumerable.prototype.orderBy = orderBy
