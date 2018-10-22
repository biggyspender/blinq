import { Enumerable, IndexedSelector } from '../Enumerable'

declare module '../Enumerable' {
  interface Enumerable<T> {
    forEach<T>(this: Enumerable<T>, action: (x: T, i: number) => void): void
  }
}
function forEach<T>(this: Enumerable<T>, action: (x: T, i: number) => void): void {
  const src = this
  let i = 0
  for (const x of src) {
    const currentIdx = i++
    action(x, currentIdx)
  }
}

Enumerable.prototype.forEach = forEach
