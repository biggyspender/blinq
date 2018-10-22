import { Enumerable, IndexedSelector, getIdentity } from '../Enumerable'
const identity = getIdentity()

declare module '../Enumerable' {
  interface Enumerable<T> {
    except<T>(this: Enumerable<T>, seq: Iterable<T>): Enumerable<T>
  }
}

function except<T>(this: Enumerable<T>, seq: Iterable<T>): Enumerable<T> {
  const set: Set<T> = new Set<T>()
  for (const item of seq) {
    set.add(item)
  }
  return this.where(item => !set.has(item))
}

Enumerable.prototype.except = except
