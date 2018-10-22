export abstract class Enumerable<T> implements Iterable<T> {
  public abstract [Symbol.iterator](): IterableIterator<T>
}
