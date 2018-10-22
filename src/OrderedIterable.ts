import GeneratorIterable from './GeneratorIterable'
import { Enumerable } from './Enumerable'
import { ThenComparerBuilder } from './ComparerBuilder'

export default class OrderedIterable<T> extends GeneratorIterable<T> {
  private src: Enumerable<T>
  private comparerBuilder: ThenComparerBuilder<T>
  constructor(src: Enumerable<T>, comparerBuilder: ThenComparerBuilder<T>) {
    const comparer = comparerBuilder.build()
    /* istanbul ignore next */
    {
      super(function*() {
        const arr = [...src].sort(comparer)
        for (const x of arr) {
          yield x
        }
      })
    }
    this.src = src
    this.comparerBuilder = comparerBuilder
  }

  public thenBy<TCmp>(selector: (x: T) => TCmp): OrderedIterable<T> {
    const newBuilder = this.comparerBuilder.thenKey(selector)
    return new OrderedIterable(this.src, newBuilder)
  }
  public thenByDescending<TCmp>(selector: (x: T) => TCmp): OrderedIterable<T> {
    const newBuilder = this.comparerBuilder.thenKeyDescending(selector)
    return new OrderedIterable(this.src, newBuilder)
  }
}
