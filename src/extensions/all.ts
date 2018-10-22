import { Enumerable, IndexedPredicate } from '../Enumerable'
import '../extensions/any'

declare module '../Enumerable' {
  interface Enumerable<T> {
    all<T>(this: Enumerable<T>, pred: IndexedPredicate<T>): boolean
  }
}

function all<T>(this: Enumerable<T>, pred: IndexedPredicate<T>): boolean {
  return !this.any((item, i) => !pred(item, i))
}

Enumerable.prototype.all = all
