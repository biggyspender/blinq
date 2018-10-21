import { Comparer } from './Comparer'
export interface BuildableComparer<T> {
  build(): Comparer<T>
}
interface BaseComparerBuilder<T> extends BuildableComparer<T> {
  sortKey<TComparable>(selector: (x: T) => TComparable): ThenComparerBuilder<T>
  sortKeyDescending<TComparable>(selector: (x: T) => TComparable): ThenComparerBuilder<T>
}
export interface ThenComparerBuilder<T> extends BuildableComparer<T> {
  thenKey<TComparable>(selector: (x: T) => TComparable): ThenComparerBuilder<T>
  thenKeyDescending<TComparable>(selector: (x: T) => TComparable): ThenComparerBuilder<T>
}
export class ComparerBuilder<T> implements BaseComparerBuilder<T>, ThenComparerBuilder<T> {
  static create<T>(): ComparerBuilder<T> {
    return new ComparerBuilder<T>()
  }
  thenKey<TComparable>(selector: (x: T) => TComparable): ThenComparerBuilder<T> {
    return this.sortKey(selector)
  }
  thenKeyDescending<TComparable>(selector: (x: T) => TComparable): ThenComparerBuilder<T> {
    return this.sortKeyDescending(selector)
  }
  private comparers: Comparer<T>[]

  constructor(comparers: Array<Comparer<T>> | undefined = undefined) {
    this.comparers = comparers || []
  }
  sortKey<TComparable>(selector: (x: T) => TComparable): ThenComparerBuilder<T> {
    const c = this.createComparer(selector, (a, b) => (a < b ? -1 : a > b ? 1 : 0))
    const newComparers = [...this.comparers]
    newComparers.push(c)
    return new ComparerBuilder<T>(newComparers)
  }
  sortKeyDescending<TComparable>(selector: (x: T) => TComparable): ThenComparerBuilder<T> {
    const c = this.createComparer(selector, (a, b) => (a < b ? 1 : a > b ? -1 : 0))
    const newComparers = [...this.comparers]
    newComparers.push(c)
    return new ComparerBuilder<T>(newComparers)
  }

  private createComparer<TComparable>(
    selector: (x: T) => TComparable,
    comparer: Comparer<TComparable>
  ): Comparer<T> {
    return (a, b) => {
      const cmpA = selector(a)
      const cmpB = selector(b)
      return comparer(cmpA, cmpB)
    }
  }

  build(): Comparer<T> {
    return (a, b) => {
      for (let i = 0; i < this.comparers.length; i++) {
        const comparer = this.comparers[i]
        const comparison = comparer(a, b)
        if (comparison !== 0) {
          return comparison
        }
      }

      return 0
    }
  }
}
