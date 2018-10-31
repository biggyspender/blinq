import { Enumerable } from '../Enumerable'

declare module '../Enumerable' {
  interface Enumerable<T> {
    aggregate<TOut>(seed: TOut, aggFunc: (prev: TOut, curr: T, idx: number) => TOut): TOut
  }
}

function aggregate<T, TOut>(
  this: Enumerable<T>,
  seed: TOut,
  aggFunc: (prev: TOut, curr: T, idx: number) => TOut
): TOut {
  let v = seed
  let i = 0
  for (const item of this) {
    v = aggFunc(v, item, i++)
  }
  return v
}
Enumerable.prototype.aggregate = aggregate
