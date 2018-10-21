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
      for (let x of it) {
        yield x
      }
    })
  }

  public static fromIterable<T>(value: Iterable<T>) {
    return Enumerable.fromGenerator(function*() {
      for (let x of value) {
        yield x
      }
    })
  }

  public static fromSingleValue<T>(value: T) {
    return Enumerable.fromGenerator(function*() {
      yield value
    })
  }

  public static range(start: number, range: number) {
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

  public static repeat<T>(item: T, numRepeats: number) {
    return Enumerable.range(0, numRepeats).select(() => item)
  }

  public static repeatGenerate<T>(generator: (i: number) => T, numRepeats: number) {
    return Enumerable.range(0, numRepeats).select(i => generator(i))
  }

  public abstract [Symbol.iterator](): IterableIterator<T>
  private truePredicate: IndexedPredicate<T> = x => true

  public aggregate<TOut>(seed: TOut, aggFunc: (prev: TOut, curr: T, idx: number) => TOut) {
    let v = seed
    let i = 0
    for (let item of this) {
      v = aggFunc(v, item, i++)
    }
    return v
  }

  public all(pred: IndexedPredicate<T>) {
    return !this.any((item, i) => !pred(item, i))
  }

  public any(pred: IndexedPredicate<T> = this.truePredicate) {
    let i = 0
    for (let item of this) {
      if (pred(item, i++)) {
        return true
      }
    }
    return false
  }

  public average(this: Enumerable<number>) {
    const f = this.aggregate(
      {
        tot: 0,
        count: 0
      },
      (acc, val) => {
        acc.tot += val
        acc.count++
        return acc
      }
    )
    if (f.count === 0) {
      throw Error('sequence contains no elements')
    }
    return f.tot / f.count
  }

  public concat(...sequences: Array<Iterable<T>>) {
    const src = this
    return Enumerable.fromGenerator(function*() {
      for (let item of src) {
        yield item
      }
      for (let seq of sequences) {
        for (let item of seq) {
          yield item
        }
      }
    })
  }

  public count(pred: IndexedPredicate<T> = this.truePredicate) {
    let c = 0
    let i = 0
    for (let item of this) {
      if (pred(item, i++)) {
        ++c
      }
    }
    return c
  }

  public defaultIfEmpty(): Enumerable<T | undefined> {
    const t = this
    return Enumerable.fromGenerator(function*() {
      let yielded = false
      for (let x of t) {
        yield x
        yielded = true
      }
      if (!yielded) {
        yield undefined
      }
    })
  }

  public distinct(): Enumerable<T> {
    return this.groupBy(x => x).select(g => g.first())
  }

  public distinctBy<TKey>(selector: IndexedSelector<T, TKey>): Enumerable<T> {
    const src = this
    return new GeneratorIterable(function*() {
      const set = new Set<TKey>()
      let i = 0
      for (let x of src) {
        const idx = i++
        const key = selector(x, idx)
        if (set.has(key)) {
          continue
        }
        set.add(key)
        yield x
      }
    })
  }

  public elementAt(index: number) {
    return this.single((x, i) => i === index)
  }

  public except(seq: Iterable<T>) {
    const set: Set<T> = new Set<T>()
    for (let item of seq) {
      set.add(item)
    }
    return this.where(item => !set.has(item))
  }

  public first(pred: IndexedPredicate<T> = this.truePredicate) {
    let i = 0
    for (let item of this) {
      if (pred(item, i++)) {
        return item
      }
    }
    throw Error('sequence contains no elements')
  }

  public firstOrDefault(pred: IndexedPredicate<T> = this.truePredicate) {
    let i = 0
    for (let item of this) {
      if (pred(item, i++)) {
        return item
      }
    }
    return undefined
  }

  public forEach(action: (x: T, i: number) => void) {
    let i = 0
    for (let item of this) {
      action(item, i++)
    }
  }

  public fullOuterGroupJoin<TRight, TKey, TOut>(
    rightSeq: Iterable<TRight>,
    leftKeySelector: IndexedSelector<T, TKey>,
    rightKeySelector: IndexedSelector<TRight, TKey>,
    selector: (o: Enumerable<T> | undefined, v: Enumerable<TRight> | undefined, k: TKey) => TOut
  ): Enumerable<TOut> {
    const right = Enumerable.fromIterable(rightSeq)
    const leftLookup = this.toLookup(leftKeySelector, x => x)
    const rightLookup = right.toLookup(rightKeySelector, x => x)
    const allKeys = leftLookup
      .select(([key, _]) => key)
      .concat(rightLookup.select(([key, _]) => key))
      .distinct()
    return allKeys
      .select(key => ({ key, leftItem: leftLookup.get(key) }))
      .select(x => ({ key: x.key, leftItem: x.leftItem, rightItem: rightLookup.get(x.key) }))
      .select(x => selector(x.leftItem, x.rightItem, x.key))
  }

  public fullOuterJoin<TRight, TKey, TOut>(
    rightSeq: Iterable<TRight>,
    leftKeySelector: IndexedSelector<T, TKey>,
    rightKeySelector: IndexedSelector<TRight, TKey>,
    selector: (o: T | undefined, v: TRight | undefined, k: TKey) => TOut
  ): Enumerable<TOut> {
    return this.fullOuterGroupJoin(rightSeq, leftKeySelector, rightKeySelector, (lft, rgt, i) => ({
      lft:
        (lft && lft.select<T | undefined>(x => x)) ||
        Enumerable.fromSingleValue<T | undefined>(undefined),
      rgt:
        (rgt && rgt.select<TRight | undefined>(x => x)) ||
        Enumerable.fromSingleValue<TRight | undefined>(undefined),
      i
    })).selectMany(x => x.lft.selectMany(l => x.rgt.select(r => selector(l, r, x.i))))
  }

  // public fullOuterJoin<TRight, TKey, TOut>(
  //     rightSeq: Iterable<TRight>,
  //     leftKeySelector: IndexedSelector<T, TKey>,
  //     rightKeySelector: IndexedSelector<TRight, TKey>,
  //     selector: (o: T | undefined, v: TRight | undefined, k: TKey) => TOut
  // ): Enumerable<TOut> {
  //     const right = Enumerable.fromIterable(rightSeq);
  //     const leftLookup = this.toLookup<TKey, T | undefined>(leftKeySelector, x => x);
  //     const rightLookup = right.toLookup<TKey, TRight | undefined>(rightKeySelector, x => x);

  //     const allKeys = leftLookup
  //         .select(([key, _]) => key)
  //         .concat(rightLookup.select(([key, _]) => key))
  //         .distinct();
  //     expect([...allKeys]).toEqual([...allKeys]);
  //     return allKeys
  //         .selectMany(
  //             key => (leftLookup.get(key) || Enumerable.fromSingleValue<T | undefined>(undefined))
  //                 .select(x => ({ key, leftItem: x })))
  //         .selectMany(
  //             x => (rightLookup.get(x.key) || Enumerable.fromSingleValue<TRight | undefined>(undefined))
  //                 .select(rightItem => selector(x.leftItem, rightItem, x.key)));
  // }

  public groupBy<TKey>(keySelector: IndexedSelector<T, TKey>) {
    const lookup = this.toLookup(keySelector, x => x)

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
  ) {
    const innerSeqIt = Enumerable.fromIterable(innerSeq)
    const lookup = innerSeqIt.toLookup(innerKeySelector, x => x)
    const outerSeq = this

    return Enumerable.fromGenerator(function*() {
      let i = 0
      for (let outerItem of outerSeq) {
        let idx = i++
        const key = outerKeySelector(outerItem, idx)
        let innerItems: Enumerable<TInner> = lookup.get(key) || Enumerable.empty()

        yield selector(outerItem, innerItems)
      }
    })
  }

  public intersect(seq: Iterable<T>) {
    const set: Set<T> = new Set()
    for (let item of seq) {
      set.add(item)
    }
    return this.where(item => set.has(item))
  }

  public isSubsetOf(seq: Iterable<T>) {
    const set = new Set(seq)
    return this.all(x => set.has(x))
  }

  public isSupersetOf(seq: Iterable<T>) {
    return Enumerable.fromIterable(seq).isSubsetOf(this)
  }

  public leftOuterJoin<TInner, TKey, TOut>(
    innerSeq: Iterable<TInner>,
    outerKeySelector: IndexedSelector<T, TKey>,
    innerKeySelector: IndexedSelector<TInner, TKey>,
    selector: (outer: T, inner: TInner | undefined) => TOut
  ) {
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
  ) {
    return this.groupJoin(innerSeq, outerKeySelector, innerKeySelector, (outer, innerSeq) => ({
      outer,
      innerSeq
    })).selectMany(({ outer, innerSeq }) => innerSeq.select(i => selector(outer, i)))
  }

  // join<TInner, TKey, TOut>(
  //     innerSeq: Iterable<TInner>,
  //     outerKeySelector: IndexedSelector<T, TKey>,
  //     innerKeySelector: IndexedSelector<TInner, TKey>,
  //     selector: (outer: T, inner: TInner) => TOut
  // ) {
  //     const innerSeqIt = Enumerable.fromIterable(innerSeq);
  //     const lookup = innerSeqIt.toLookup(innerKeySelector, x => x);
  //     const outerSeq = this;

  //     return Enumerable.fromGenerator(function* () {
  //         let i = 0;
  //         for (let outerItem of outerSeq) {
  //             const outerKey = outerKeySelector(outerItem, i++);
  //             let innerItems = lookup.get(outerKey) || Enumerable.empty();

  //             for (let innerItem of innerItems) {
  //                 yield selector(outerItem, innerItem);
  //             }
  //         }
  //     });
  // }

  public last(pred: IndexedPredicate<T> = this.truePredicate) {
    let i = 0
    let returnVal
    let found = false
    for (let item of this) {
      if (pred(item, i++)) {
        returnVal = item
        found = true
      }
    }
    if (found) {
      return returnVal
    } else {
      throw Error('sequence contains no elements')
    }
  }

  public lastOrDefault(pred: IndexedPredicate<T> = this.truePredicate) {
    let i = 0
    let returnVal
    for (let item of this) {
      if (pred(item, i++)) {
        returnVal = item
      }
    }
    return returnVal
  }

  public max(this: Enumerable<number>, pred: IndexedPredicate<number> = this.truePredicate) {
    return this.where(pred).maxBy(x => x)
  }

  public maxBy<TKey>(selector: IndexedSelector<T, TKey>) {
    return minMaxByImpl(this, selector, (a, b) => a > b)
  }

  public min(this: Enumerable<number>, pred: IndexedPredicate<number> = this.truePredicate) {
    return this.where(pred).minBy(x => x)
  }

  public minBy<TKey>(selector: IndexedSelector<T, TKey>) {
    return minMaxByImpl(this, selector, (a, b) => a < b)
  }

  public orderBy<TCmp>(selector: (x: T) => TCmp): OrderedIterable<T> {
    const builder = ComparerBuilder.create<T>().sortKey(selector)
    return new OrderedIterable<T>(this, builder)
  }

  public orderByDescending<TCmp>(selector: (x: T) => TCmp): OrderedIterable<T> {
    const builder = ComparerBuilder.create<T>().sortKeyDescending(selector)
    return new OrderedIterable<T>(this, builder)
  }

  public reverse() {
    return Enumerable.fromIterable([...this].reverse())
  }

  public select<TOut>(selector: IndexedSelector<T, TOut>) {
    const src = this
    return Enumerable.fromGenerator(function*() {
      let c = 0
      for (let x of src) {
        yield selector(x, c++)
      }
    })
  }

  public selectMany<TOut>(selector: IndexedSelector<T, Iterable<TOut>>) {
    const src = this
    return Enumerable.fromGenerator(function*() {
      let i = 0
      for (let seq of src) {
        for (let item of selector(seq, i++)) {
          yield item
        }
      }
    })
  }

  public sequenceEqual(seq: Iterable<T>) {
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
    for (let item of this) {
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

  public singleOrDefault(pred: IndexedPredicate<T> = this.truePredicate) {
    let itemCount = 0
    let foundItem
    let i = 0
    for (let item of this) {
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

  public skip(numItems: number) {
    return this.skipWhile((_, i) => i < numItems)
  }

  public skipWhile(pred: IndexedPredicate<T>) {
    const src = this
    return Enumerable.fromGenerator(function*() {
      let i = 0
      for (let item of src) {
        const result = pred(item, i++)
        if (result) {
          continue
        }
        yield item
      }
    })
  }

  public sum(this: Enumerable<number>) {
    return this.aggregate(0, (acc, val) => acc + val)
  }

  public take(numItems: number) {
    return this.takeWhile((_, i) => i < numItems)
  }

  public takeWhile(pred: IndexedPredicate<T>) {
    const src = this
    return Enumerable.fromGenerator(function*() {
      let i = 0
      for (let item of src) {
        const result = pred(item, i++)
        if (!result) {
          break
        }
        yield item
      }
    })
  }

  public toArray() {
    return [...this]
  }

  public toLookup<TKey, TValue>(
    keySelector: IndexedSelector<T, TKey>,
    valueSelector: IndexedSelector<T, TValue>
  ): MapIterable<TKey, Enumerable<TValue>> {
    const map: Map<TKey, ArrayIterable<TValue>> = new Map()
    let i = 0
    for (let item of this) {
      let currentIdx = i++
      const key = keySelector(item, currentIdx)
      let arr: ArrayIterable<TValue>

      arr = map.get(key) || new ArrayIterable<TValue>([])
      map.set(key, arr)
      arr.push(valueSelector(item, currentIdx))
    }
    return new MapIterable<TKey, Enumerable<TValue>>(map)
  }

  public toMap<TKey, TValue>(
    keySelector: IndexedSelector<T, TKey>,
    valueSelector: IndexedSelector<T, TValue>
  ): MapIterable<TKey, TValue> {
    const map = new Map<TKey, TValue>()
    let i = 0
    for (let x of this) {
      const idx = i++
      const key = keySelector(x, i)
      if (map.has(key)) {
        throw Error('duplicate key')
      }
      map.set(key, valueSelector(x, i))
    }
    return new MapIterable(map)
  }

  public union(seq: Iterable<T>) {
    return this.concat(seq).distinct()
  }

  public where(pred: IndexedPredicate<T>) {
    const src = this
    return Enumerable.fromGenerator(function*() {
      let i = 0
      for (let x of src) {
        if (pred(x, i++)) {
          yield x
        }
      }
    })
  }

  public zip<TOther, TOut>(seq: Iterable<TOther>, selector: (item1: T, item2: TOther) => TOut) {
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
        for (let x of arr) {
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
        for (let x of it) {
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
        for (let x of arr) {
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

function minMaxByImpl<T, TKey>(
  src: Iterable<T>,
  selector: IndexedSelector<T, TKey>,
  comparer: (a: TKey, b: TKey) => boolean
): T {
  let currentBest: [TKey, T] | undefined
  let i = 0
  for (let item of src) {
    const idx = i++
    const key = selector(item, idx)
    if (typeof currentBest === 'undefined') {
      currentBest = [key, item]
    } else {
      const bestKey = currentBest[0]
      if (comparer(key, bestKey)) {
        currentBest = [key, item]
      }
    }
  }
  if (typeof currentBest === 'undefined') {
    throw Error('sequence contains no elements')
  }
  const returnItem = currentBest[1]
  return returnItem
}
