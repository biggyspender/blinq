import { Enumerable, getIdentity } from '../Enumerable'
import './distinctBy'
declare module '../Enumerable' {
  interface Enumerable<T> {
    distinct<T>(this: Enumerable<T>): Enumerable<T>
  }
}

function distinct<T>(this: Enumerable<T>): Enumerable<T> {
  return this.distinctBy(x => x)
}

Enumerable.prototype.distinct = distinct
