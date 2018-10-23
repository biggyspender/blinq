import { Enumerable } from '../Enumerable'
import * as EnumerableGenerators from '../EnumerableGenerators'

declare module '../Enumerable' {
  interface Enumerable<T> {
    zipAll<TT>(this: Enumerable<Enumerable<TT>>): Enumerable<Enumerable<TT>>
  }
}

function zipAll<TT>(this: Enumerable<Enumerable<TT>>): Enumerable<Enumerable<TT>> {
  const v = this.aggregate<Enumerable<Enumerable<TT>> | undefined>(
    undefined,
    (acc, curr) =>
      typeof acc === 'undefined'
        ? EnumerableGenerators.fromIterable(curr).select(x =>
            EnumerableGenerators.fromSingleValue(x)
          )
        : acc.zip(curr, (a, c) => a.append(c))
  )
  /* istanbul ignore next */
  return typeof v === 'undefined' ? EnumerableGenerators.empty<Enumerable<TT>>() : v
}
Enumerable.prototype.zipAll = zipAll
