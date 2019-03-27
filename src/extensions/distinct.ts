import { Enumerable } from '../Enumerable'
import './distinctBy'
import { EqualityComparer } from '../blinq'
declare module '../Enumerable' {
  interface Enumerable<T> {
    distinct<T>(this: Enumerable<T>, equalityComparer?: EqualityComparer<T>): Enumerable<T>
  }
}

function distinct<T>(this: Enumerable<T>, equalityComparer?: EqualityComparer<T>): Enumerable<T> {
  return this.distinctBy(x => x, equalityComparer)
}

Enumerable.prototype.distinct = distinct
