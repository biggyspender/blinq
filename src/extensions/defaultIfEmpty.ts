import { Enumerable } from '../Enumerable'
import * as EnumerableGenerators from '../EnumerableGenerators'

declare module '../Enumerable' {
  interface Enumerable<T> {
    defaultIfEmpty<T>(this: Enumerable<T>): Enumerable<T | undefined>
  }
}

function defaultIfEmpty<T>(this: Enumerable<T>): Enumerable<T | undefined> {
  const t = this
  return EnumerableGenerators.fromGenerator(function*() {
    let yielded = false
    for (const x of t) {
      yield x
      yielded = true
    }
    if (!yielded) {
      yield undefined
    }
  })
}
Enumerable.prototype.defaultIfEmpty = defaultIfEmpty
