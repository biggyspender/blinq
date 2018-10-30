/**
 * base type for all operations, can be created using the EnumerableGenerators module
 */
export abstract class Enumerable<T> implements Iterable<T> {
  public abstract [Symbol.iterator](): IterableIterator<T>
  public isEnumerable = true
}
