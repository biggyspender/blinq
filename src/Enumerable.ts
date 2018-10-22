import { ComparerBuilder, ThenComparerBuilder } from './ComparerBuilder'
export type IndexedPredicate<T> = (x: T, i: number) => Boolean
export type IndexedSelector<T, TOut> = (x: T, i: number) => TOut
export abstract class Enumerable<T> implements Iterable<T> {
  public static empty<T>() {
    return Enumerable.fromIterable<T>([])
  }

  public static fromGenerator<T>(gen: () => Iterable<T>): Enumerable<T> {
    return new GeneratorIterable<T>(function*() {
      const it = gen()
      for (const x of it) {
        yield x
      }
    })
  }

  public static fromIterable<T>(value: Iterable<T>): Enumerable<T> {
    return Enumerable.fromGenerator(function*() {
      for (const x of value) {
        yield x
      }
    })
  }

  public static fromSingleValue<T>(value: T): Enumerable<T> {
    return Enumerable.fromGenerator(function*() {
      yield value
    })
  }

  public static range(start: number, range: number): Enumerable<number> {
    if (Math.trunc(start) !== start) {
      throw Error('start must be an integral value')
    }
    if (Math.trunc(range) !== range) {
      throw Error('range must be an integral value')
    }
    if (range < 0) {
      throw Error('range must be >= 0')
    }
    return Enumerable.fromGenerator(function*() {
      for (let i = 0; i < range; ++i) {
        yield i + start
      }
    })
  }

  public static repeat<T>(item: T, numRepeats: number): Enumerable<T> {
    return Enumerable.range(0, numRepeats).select(() => item)
  }

  public static repeatGenerate<T>(generator: (i: number) => T, numRepeats: number): Enumerable<T> {
    return Enumerable.range(0, numRepeats).select(i => generator(i))
  }

  public abstract [Symbol.iterator](): IterableIterator<T>
  private truePredicate: IndexedPredicate<T> = x => true

  public aggregate<TOut>(seed: TOut, aggFunc: (prev: TOut, curr: T, idx: number) => TOut): TOut {
    let v = seed
    let i = 0
    for (const item of this) {
      v = aggFunc(v, item, i++)
    }
    return v
  }

  public defaultIfEmpty(): Enumerable<T | undefined> {
    const t = this
    return Enumerable.fromGenerator(function*() {
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

  public groupBy<TKey>(
    keySelector: IndexedSelector<T, TKey>
  ): Enumerable<GroupedIterable<TKey, T>> {
    const lookup = this.toLookup(keySelector)

    return lookup.select(([key, value]) => {
      const returnValue = new GroupedIterable(key, value)

      return returnValue
    })
  }

  public groupJoin<TInner, TKey, TOut>(
    innerSeq: Iterable<TInner>,
    outerKeySelector: IndexedSelector<T, TKey>,
    innerKeySelector: IndexedSelector<TInner, TKey>,
    selector: (o: T, v: Enumerable<TInner>) => TOut
  ): Enumerable<TOut> {
    const innerSeqIt = Enumerable.fromIterable(innerSeq)
    const lookup = innerSeqIt.toLookup(innerKeySelector)
    const outerSeq = this

    return Enumerable.fromGenerator(function*() {
      let i = 0
      for (const outerItem of outerSeq) {
        let idx = i++
        const key = outerKeySelector(outerItem, idx)
        let innerItems: Enumerable<TInner> = lookup.get(key) || Enumerable.empty()

        yield selector(outerItem, innerItems)
      }
    })
  }

  public leftOuterJoin<TInner, TKey, TOut>(
    innerSeq: Iterable<TInner>,
    outerKeySelector: IndexedSelector<T, TKey>,
    innerKeySelector: IndexedSelector<TInner, TKey>,
    selector: (outer: T, inner: TInner | undefined) => TOut
  ): Enumerable<TOut> {
    return this.groupJoin(innerSeq, outerKeySelector, innerKeySelector, (outer, innerSeq) => ({
      outer,
      innerSeq
    })).selectMany(({ outer, innerSeq }) =>
      innerSeq.defaultIfEmpty().select(i => selector(outer, i))
    )
  }

  public join<TInner, TKey, TOut>(
    innerSeq: Iterable<TInner>,
    outerKeySelector: IndexedSelector<T, TKey>,
    innerKeySelector: IndexedSelector<TInner, TKey>,
    selector: (outer: T, inner: TInner) => TOut
  ): Enumerable<TOut> {
    return this.groupJoin(innerSeq, outerKeySelector, innerKeySelector, (outer, innerSeq) => ({
      outer,
      innerSeq
    })).selectMany(({ outer, innerSeq }) => innerSeq.select(i => selector(outer, i)))
  }

  public orderBy<TCmp>(selector: (x: T) => TCmp): OrderedIterable<T> {
    const builder = ComparerBuilder.create<T>().sortKey(selector)
    return new OrderedIterable<T>(this, builder)
  }

  public orderByDescending<TCmp>(selector: (x: T) => TCmp): OrderedIterable<T> {
    const builder = ComparerBuilder.create<T>().sortKeyDescending(selector)
    return new OrderedIterable<T>(this, builder)
  }

  public prepend(item: T): Enumerable<T> {
    return Enumerable.fromSingleValue(item).concat(this)
  }

  public reverse(): Enumerable<T> {
    return Enumerable.fromGenerator(() => [...this].reverse())
  }

  public select<TOut>(selector: IndexedSelector<T, TOut>): Enumerable<TOut> {
    const src = this
    return Enumerable.fromGenerator(function*() {
      let c = 0
      for (const x of src) {
        yield selector(x, c++)
      }
    })
  }

  public selectMany<TOut>(selector: IndexedSelector<T, Iterable<TOut>>): Enumerable<TOut> {
    const src = this
    return Enumerable.fromGenerator(function*() {
      let i = 0
      for (const seq of src) {
        for (const item of selector(seq, i++)) {
          yield item
        }
      }
    })
  }

  public sequenceEqual(seq: Iterable<T>): boolean {
    const it1 = this[Symbol.iterator]()
    const it2 = seq[Symbol.iterator]()
    for (;;) {
      const it1Result = it1.next()
      const it2Result = it2.next()
      if (it1Result.done && it2Result.done) {
        return true
      }
      if (it1Result.done || it2Result.done) {
        return false
      }
      if (it1Result.value !== it2Result.value) {
        return false
      }
    }
  }

  public single(pred: IndexedPredicate<T> = this.truePredicate): T {
    let itemCount = 0
    let foundItem
    let i = 0
    for (const item of this) {
      if (pred(item, i++)) {
        ++itemCount
        if (itemCount > 1) {
          throw Error('sequence contains more than one element')
        }
        foundItem = item
      }
    }
    if (itemCount === 1) {
      /* istanbul ignore next */
      if (foundItem) {
        return foundItem
      }
    }
    throw Error('sequence contains no elements')
  }

  public singleOrDefault(pred: IndexedPredicate<T> = this.truePredicate): T | undefined {
    let itemCount = 0
    let foundItem
    let i = 0
    for (const item of this) {
      if (pred(item, i++)) {
        ++itemCount
        if (itemCount > 1) {
          throw Error('sequence contains more than one element')
        }
        foundItem = item
      }
    }
    if (itemCount === 1) {
      // ReSharper disable once UsageOfPossiblyUnassignedValue
      return foundItem
    }
    return undefined
  }

  public skip(numItems: number): Enumerable<T> {
    return this.skipWhile((_, i) => i < numItems)
  }

  public skipWhile(pred: IndexedPredicate<T>): Enumerable<T> {
    const src = this
    return Enumerable.fromGenerator(function*() {
      let i = 0
      for (const item of src) {
        const result = pred(item, i++)
        if (result) {
          continue
        }
        yield item
      }
    })
  }

  public take(numItems: number): Enumerable<T> {
    return this.takeWhile((_, i) => i < numItems)
  }

  public takeWhile(pred: IndexedPredicate<T>): Enumerable<T> {
    const src = this
    return Enumerable.fromGenerator(function*() {
      let i = 0
      for (const item of src) {
        const result = pred(item, i++)
        if (!result) {
          break
        }
        yield item
      }
    })
  }

  public toArray(): T[] {
    return [...this]
  }

  public toLookup<TKey>(keySelector: IndexedSelector<T, TKey>): MapIterable<TKey, Enumerable<T>>
  public toLookup<TKey, TValue>(
    keySelector: IndexedSelector<T, TKey>,
    valueSelector: IndexedSelector<T, TValue>
  ): MapIterable<TKey, Enumerable<TValue>>
  public toLookup<TKey, TValue>(
    keySelector: IndexedSelector<T, TKey>,
    valueSelector?: IndexedSelector<T, TValue>
  ): MapIterable<TKey, Enumerable<T | TValue>> {
    const vs: (v: T, i: number) => T | TValue = valueSelector || identity

    const map: Map<TKey, ArrayIterable<T | TValue>> = new Map()
    let i = 0
    for (const item of this) {
      let currentIdx = i++
      const key = keySelector(item, currentIdx)
      let arr: ArrayIterable<T | TValue>

      arr = map.get(key) || new ArrayIterable<T | TValue>([])
      map.set(key, arr)
      arr.push(vs(item, currentIdx))
    }
    return new MapIterable<TKey, Enumerable<T | TValue>>(map)
  }

  public toMap<TKey, TValue>(
    keySelector: IndexedSelector<T, TKey>,
    valueSelector: IndexedSelector<T, TValue>
  ): MapIterable<TKey, TValue> {
    const map = new Map<TKey, TValue>()
    let i = 0
    for (const x of this) {
      const idx = i++
      const key = keySelector(x, i)
      if (map.has(key)) {
        throw Error('duplicate key')
      }
      map.set(key, valueSelector(x, i))
    }
    return new MapIterable(map)
  }

  public union(seq: Iterable<T>): Enumerable<T> {
    return this.concat(seq).distinct()
  }

  public where(pred: IndexedPredicate<T>): Enumerable<T> {
    const src = this
    return Enumerable.fromGenerator(function*() {
      let i = 0
      for (const x of src) {
        if (pred(x, i++)) {
          yield x
        }
      }
    })
  }

  public zip<TOther, TOut>(
    seq: Iterable<TOther>,
    selector: (item1: T, item2: TOther) => TOut
  ): Enumerable<TOut> {
    const src = this

    return Enumerable.fromGenerator(function*() {
      const it1 = src[Symbol.iterator]()
      const it2 = seq[Symbol.iterator]()

      for (;;) {
        const it1Result = it1.next()
        const it2Result = it2.next()

        if (it1Result.done || it2Result.done) {
          break
        }
        yield selector(it1Result.value, it2Result.value)
      }
    })
  }
}
class GeneratorIterable<T> extends Enumerable<T> {
  [Symbol.iterator](): IterableIterator<T> {
    return this.gen()
  }
  constructor(gen: () => IterableIterator<T>) {
    super()
    this.gen = gen
  }
  gen: () => IterableIterator<T>
}
class ArrayIterable<T> extends GeneratorIterable<T> {
  // @propertyIsEnumerable(false)
  private _underlyingArray: T[]

  constructor(arr: Array<T>) {
    /* istanbul ignore next */
    {
      super(function*() {
        for (const x of arr) {
          yield x
        }
      })
    }
    this._underlyingArray = arr
  }
  public push(item: T) {
    this._underlyingArray.push(item)
  }
}

class WrapperIterable<T> extends GeneratorIterable<T> {
  constructor(it: Iterable<T>) {
    /* istanbul ignore next */
    {
      super(function*() {
        for (const x of it) {
          yield x
        }
      })
    }
  }
}

export class SetIterable<T> extends WrapperIterable<T> {
  private _underlyingSet: Set<T>

  constructor(set: Set<T>) {
    /* istanbul ignore next */
    {
      super(set)
    }
    this._underlyingSet = set
  }

  entries() {
    return Enumerable.fromIterable(this._underlyingSet.entries())
  }

  values() {
    return Enumerable.fromIterable(this._underlyingSet.values())
  }

  has(v: T) {
    return this._underlyingSet.has(v)
  }
}
export class MapIterable<TKey, TValue> extends WrapperIterable<[TKey, TValue]> {
  private _underlyingMap: Map<TKey, TValue>
  constructor(map: Map<TKey, TValue>) {
    /* istanbul ignore next */
    {
      super(map)
    }
    this._underlyingMap = map
  }

  keys() {
    return Enumerable.fromIterable(this._underlyingMap.keys())
  }

  entries() {
    return Enumerable.fromIterable(this._underlyingMap.entries())
  }

  values() {
    return Enumerable.fromIterable(this._underlyingMap.values())
  }

  has(v: TKey) {
    return this._underlyingMap.has(v)
  }

  get(key: TKey) {
    return this._underlyingMap.get(key)
  }

  convertToObject(this: MapIterable<string, TValue>) {
    return this.entries().aggregate({}, (acc: any, [key, value]) => {
      acc[key] = value
      return acc
    })
  }
}

class GroupedIterable<TKey, TValue> extends WrapperIterable<TValue> {
  private _key: any
  get key(): TKey {
    return this._key
  }
  constructor(key: TKey, it: Iterable<TValue>) {
    /* istanbul ignore next */
    {
      super(it)
    }
    this._key = key
  }
}

class OrderedIterable<T> extends GeneratorIterable<T> {
  private src: Enumerable<T>
  private comparerBuilder: ThenComparerBuilder<T>
  constructor(src: Enumerable<T>, comparerBuilder: ThenComparerBuilder<T>) {
    const comparer = comparerBuilder.build()
    /* istanbul ignore next */
    {
      super(function*() {
        const arr = [...src].sort(comparer)
        for (const x of arr) {
          yield x
        }
      })
    }
    this.src = src
    this.comparerBuilder = comparerBuilder
  }

  public thenBy<TCmp>(selector: (x: T) => TCmp): OrderedIterable<T> {
    const newBuilder = this.comparerBuilder.thenKey(selector)
    return new OrderedIterable(this.src, newBuilder)
  }
  public thenByDescending<TCmp>(selector: (x: T) => TCmp): OrderedIterable<T> {
    const newBuilder = this.comparerBuilder.thenKeyDescending(selector)
    return new OrderedIterable(this.src, newBuilder)
  }
}

export function getIdentity() {
  return <T>(t: T) => t
}
const identity = getIdentity()

export function getDefaultComparer() {
  return <T>(a: T, b: T): number => (a > b ? 1 : a < b ? -1 : 0)
}
const defaultComparer = getDefaultComparer()
