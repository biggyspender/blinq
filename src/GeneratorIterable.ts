import { Enumerable } from './Enumerable'
export default class GeneratorIterable<T> extends Enumerable<T> {
  [Symbol.iterator](): IterableIterator<T> {
    return this.gen()
  }
  constructor(gen: () => IterableIterator<T>) {
    super()
    this.gen = gen
  }
  gen: () => IterableIterator<T>
}
