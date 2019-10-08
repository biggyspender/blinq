import { Enumerable } from '../Enumerable'
import OrderedIterable, { OrderedItem } from '../OrderedIterable'
import { ComparerBuilder } from '../ComparerBuilder'
declare module '../Enumerable' {
  interface Enumerable<T> {
    orderByDescending<TCmp>(this: Enumerable<T>, selector: (x: T) => TCmp): OrderedIterable<T>
  }
}

function orderByDescending<T, TCmp>(
  this: Enumerable<T>,
  selector: (x: T) => TCmp
): OrderedIterable<T> {
  const wrapped: Enumerable<OrderedItem<T>> = this.select(item => ({
    item,
    orders: [selector(item)]
  }))
  const builder = ComparerBuilder.create<OrderedItem<T>>().sortKeyDescending(x => x.orders[0])
  return new OrderedIterable<T>(wrapped, builder)
}
Enumerable.prototype.orderByDescending = orderByDescending
