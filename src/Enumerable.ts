export type IndexedPredicate<T> = (x: T, i: number) => Boolean
export type IndexedSelector<T, TOut> = (x: T, i: number) => TOut
export abstract class Enumerable<T> implements Iterable<T> {
  public abstract [Symbol.iterator](): IterableIterator<T>
}

export function getDefaultComparer() {
  return <T>(a: T, b: T): number => (a > b ? 1 : a < b ? -1 : 0)
}
