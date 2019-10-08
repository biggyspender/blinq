import { Enumerable } from '../Enumerable'
import OrderedIterable, { OrderedItem } from '../OrderedIterable'
import { ComparerBuilder } from '../ComparerBuilder'
declare module '../Enumerable' {
  interface Enumerable<T> {
    orderBy<TCmp>(this: Enumerable<T>, selector: (x: T) => TCmp): OrderedIterable<T>
  }
}

function orderBy<T, TCmp>(this: Enumerable<T>, selector: (x: T) => TCmp): OrderedIterable<T> {
  const wrapped: Enumerable<OrderedItem<T>> = this.select(item => ({
    item,
    orders: [selector(item)]
  }))
  const builder = ComparerBuilder.create<OrderedItem<T>>().sortKey(x => x.orders[0])
  return new OrderedIterable<T>(wrapped, builder)
}
Enumerable.prototype.orderBy = orderBy
