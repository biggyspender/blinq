import GeneratorIterable from './GeneratorIterable'
import { Enumerable } from './Enumerable'
import { ThenComparerBuilder } from './ComparerBuilder'
export interface OrderedItem<T> {
  item: T
  orders: any[]
}
export default class OrderedIterable<T> extends GeneratorIterable<T> {
  private src: Enumerable<OrderedItem<T>>
  private comparerBuilder: ThenComparerBuilder<OrderedItem<T>>
  private depth: number
  constructor(
    src: Enumerable<OrderedItem<T>>,
    comparerBuilder: ThenComparerBuilder<OrderedItem<T>>,
    depth: number = 0
  ) {
    const comparer = comparerBuilder.build()
    /* istanbul ignore next */
    {
      super(function*() {
        const arr = [...src].sort(comparer)
        for (const x of arr) {
          yield x.item
        }
      })
    }
    this.src = src
    this.comparerBuilder = comparerBuilder
    this.depth = depth
  }

  public thenBy<TCmp>(selector: (x: T) => TCmp): OrderedIterable<T> {
    const wrapped: Enumerable<OrderedItem<T>> = this.src.select(item => ({
      ...item,
      orders: [...item.orders, selector(item.item)]
    }))
    const newBuilder = this.comparerBuilder.thenKey(x => x.orders[this.depth + 1])
    return new OrderedIterable(wrapped, newBuilder, this.depth + 1)
  }
  public thenByDescending<TCmp>(selector: (x: T) => TCmp): OrderedIterable<T> {
    const wrapped: Enumerable<OrderedItem<T>> = this.src.select(item => ({
      ...item,
      orders: [...item.orders, selector(item.item)]
    }))
    const newBuilder = this.comparerBuilder.thenKeyDescending(x => x.orders[this.depth + 1])
    return new OrderedIterable(wrapped, newBuilder, this.depth + 1)
  }
}
