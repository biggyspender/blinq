import {
  blinq,
  range,
  fromSingleValue,
  repeat,
  repeatGenerate,
  empty,
  defaultComparer,
  identity
} from '../src/blinq'
import { Enumerable } from '../src/Enumerable'
import { Date } from './Date'
import { deepEqualityComparer } from '../src/comparer/deepEqualityComparer'

describe('blinq test', () => {
  it('RangeIterable generates range', () => {
    const it = range(0, 3)

    expect([...it]).toEqual([0, 1, 2])
    expect([...it]).toEqual([0, 1, 2])
  })
  it('RangeIterable args validation works', () => {
    expect(() => range(0, -1)).toThrow()
    expect(() => range(0.1, 1)).toThrow()
    expect(() => range(0, 1.1)).toThrow()
  })
  it('where works', () => {
    const it = range(0, 3)
    const whereQ = it.where(x => x > 0)
    expect([...whereQ]).toEqual([1, 2])
    expect([...whereQ]).toEqual([1, 2])
  })
  it('select works', () => {
    const it = range(0, 3)
    const selected = it.select(x => x * 2)
    expect([...selected]).toEqual([0, 2, 4])
    expect([...selected]).toEqual([0, 2, 4])
  })
  it('distinctBy', () => {
    const dates: Date[] = [
      { day: 1, month: 10, year: 2000 },
      { day: 1, month: 1, year: 2000 },
      { day: 2, month: 1, year: 2000 },
      { day: 1, month: 1, year: 1999 },
      { day: 1, month: 1, year: 2000 }
    ]
    expect(
      blinq(dates)
        .distinctBy(d => d.year)
        .count()
    ).toBe(2)
  })
  it('distinctBy with comparer', () => {
    const nums = range(0, 1000).select(x => (x / 5) | 0)
    expect(
      blinq(nums)
        .distinctBy(d => d, deepEqualityComparer)
        .count()
    ).toBe(200)
  })
  it('orderBy', () => {
    const dates: Date[] = [
      { day: 1, month: 10, year: 2000 },
      { day: 1, month: 1, year: 2000 },
      { day: 2, month: 1, year: 2000 },
      { day: 1, month: 1, year: 1999 },
      { day: 1, month: 1, year: 2000 }
    ]
    const sortedDates = blinq(dates)
      .orderBy(x => x.year)
      .thenBy(x => x.month)
      .thenBy(x => x.day)
      .toArray()
    expect(sortedDates).toEqual([
      { day: 1, month: 1, year: 1999 },
      { day: 1, month: 1, year: 2000 },
      { day: 1, month: 1, year: 2000 },
      { day: 2, month: 1, year: 2000 },
      { day: 1, month: 10, year: 2000 }
    ])
    const sortedDates2 = blinq(sortedDates)
      .orderByDescending(x => x.year)
      .thenByDescending(x => x.month)
      .thenByDescending(x => x.day)
      .toArray()
    expect(sortedDates2).toEqual([
      { day: 1, month: 10, year: 2000 },
      { day: 2, month: 1, year: 2000 },
      { day: 1, month: 1, year: 2000 },
      { day: 1, month: 1, year: 2000 },
      { day: 1, month: 1, year: 1999 }
    ])
    expect(
      blinq([1, 2])
        .orderByDescending(x => x)
        .toArray()
    ).toEqual([2, 1])
    expect(
      blinq([2, 1])
        .orderByDescending(x => x)
        .toArray()
    ).toEqual([2, 1])
    expect(
      blinq([0, 0])
        .orderByDescending(x => x)
        .toArray()
    ).toEqual([0, 0])
  })
  it('can compose', () => {
    const it = range(0, 3)
    const selected = it.select(x => x * 2)
    const selectedFiltered = selected.where(x => x > 2)
    expect([...selectedFiltered]).toEqual([4])
    expect([...selectedFiltered]).toEqual([4])
  })
  it('selectMany', () => {
    const it = range(0, 2)
    const selected = it.selectMany(_ => [1, 2])
    expect([...selected]).toEqual([1, 2, 1, 2])
  })

  it('fromSingle', () => {
    const it = fromSingleValue(1)
    expect([...it]).toEqual([1])
  })

  it('repeat', () => {
    const it = repeat(1, 2)
    expect([...it]).toEqual([1, 1])
  })
  it('repeatGenerate', () => {
    const it = repeatGenerate(i => i, 3)
    expect([...it]).toEqual([0, 1, 2])

    const src = repeatGenerate(() => Math.random(), 1000)
    expect(src.sequenceEqual(src)).toBeFalsy()
  })
  it('aggregate', () => {
    const v = range(0, 4).aggregate(0, (prev, curr) => prev + curr)
    expect(v).toEqual(6)
  })
  it('all', () => {
    const fourZeroes = repeat(0, 4)
    const val = fourZeroes.all(v => v === 1)
    expect(val).toEqual(false)
    const val2 = fourZeroes.all(v => v === 0)
    expect(val2).toEqual(true)
    const val3 = fourZeroes.all(v => v === 1)
    expect(val3).toEqual(false)
  })
  it('any', () => {
    const fourZeroes = repeat(0, 4)

    expect(fourZeroes.any(x => x === 1)).toBe(false)
    expect(fourZeroes.any(x => x === 0)).toBe(true)
    expect(fourZeroes.any()).toBe(true)
    expect(empty<number>().any()).toBe(false)
  })
  it('fromIterable', () => {
    expect([...blinq([1, 2, 3])]).toEqual([1, 2, 3])
  })
  it('concat', () => {
    expect([...blinq([1, 2, 3]).concat([4, 5], [6, 7])]).toEqual([1, 2, 3, 4, 5, 6, 7])
  })
  it('average', () => {
    expect(blinq([1, 2, 3, 4]).average()).toBe(2.5)
    expect(() => empty<number>().average()).toThrow()
  })
  it('count', () => {
    expect(blinq([1, 2, 3, 4]).count()).toBe(4)
    expect(empty<number>().count()).toBe(0)
    expect(blinq([1, 2, 3, 4]).count(x => x > 2)).toBe(2)
  })
  it('single', () => {
    expect(blinq([1]).single()).toBe(1)
    expect(() => empty<number>().single()).toThrow()
    expect(() => blinq([1, 2]).single()).toThrow()
    expect(() => blinq([1, 2]).single(x => x > 2)).toThrow()
    expect(blinq([1, 2]).single(x => x > 1)).toBe(2)
    expect(blinq([false]).single()).toEqual(false)
  })
  it('singleOrDefault', () => {
    expect(blinq([1]).singleOrDefault()).toBe(1)
    expect(empty<number>().singleOrDefault()).toBeUndefined()
    expect(() => blinq([1, 2]).singleOrDefault()).toThrow()
    expect(blinq([1, 2]).singleOrDefault(x => x > 2)).toBeUndefined()
    expect(blinq([1, 2]).singleOrDefault(x => x > 1)).toBe(2)
    expect(blinq([false]).single()).toEqual(false)
  })
  it('elementAt', () => {
    expect(blinq([1, 2, 3]).elementAt(1)).toBe(2)
    expect(() => blinq([1, 2, 3]).elementAt(3)).toThrow()
  })

  it('except', () => {
    expect([...blinq([1, 2, 3]).except([1, 3])]).toEqual([2])
  })
  it('first', () => {
    expect(range(0, 3).first()).toBe(0)
    expect(range(0, 3).first(x => x > 0)).toBe(1)
    expect(() => range(0, 3).first(x => x > 2)).toThrow()
    expect(blinq([false]).first()).toEqual(false)
  })
  it('firstOrDefault', () => {
    expect(range(0, 3).firstOrDefault()).toBe(0)
    expect(range(0, 3).firstOrDefault(x => x > 0)).toBe(1)
    expect(range(0, 3).firstOrDefault(x => x > 2)).toBeUndefined()
    expect(blinq([false]).firstOrDefault()).toEqual(false)
  })
  it('last', () => {
    expect(range(0, 3).last()).toBe(2)
    expect(range(0, 3).last(x => x < 2)).toBe(1)
    expect(() => range(0, 3).last(x => x > 2)).toThrow()
    expect(() => blinq([false]).last()).not.toThrow()
  })
  it('lastOrDefault', () => {
    expect(range(0, 3).lastOrDefault()).toBe(2)
    expect(range(0, 3).lastOrDefault(x => x < 2)).toBe(1)
    expect(range(0, 3).lastOrDefault(x => x > 2)).toBeUndefined()
    expect(() => blinq([false]).lastOrDefault()).not.toThrow()
  })
  it('forEach', () => {
    range(0, 3).forEach((x, i) => expect(x).toBe(i))
  })
  it('intersect', () => {
    expect([...range(0, 5).intersect(range(3, 10))]).toEqual([3, 4])
  })
  it('intersect with comparer', () => {
    expect([...range(0, 5).intersect(range(3, 10), deepEqualityComparer)]).toEqual([3, 4])
  })

  it('isSubsetOf', () => {
    expect(range(0, 2).isSubsetOf([0, 1, 2, 3])).toEqual(true)
    expect(range(-2, 2).isSubsetOf([0, 1, 2, 3])).toEqual(false)
  })
  it('isSupersetOf', () => {
    expect(range(0, 5).isSupersetOf([0, 1])).toEqual(true)
    expect(range(0, 5).isSupersetOf([6, 7])).toEqual(false)
  })
  it('max', () => {
    expect(() => empty<number>().max()).toThrow()
    expect(fromSingleValue(1).max()).toBe(1)
    expect(blinq([5, 4, 3, 2, 1]).max()).toBe(5)
    expect(
      blinq([5, 4, 3, 2, 1])
        .select(x => repeat(x, 2).toArray())
        .max(([x, _]) => x)
    ).toBe(5)
    expect(blinq([5, 4, 3, 2, 1]).max(x => x, (a, b) => -defaultComparer(a, b))).toBe(1)
  })
  it('min', () => {
    expect(() => empty<number>().min()).toThrow()
    expect(fromSingleValue(1).min()).toBe(1)
    expect(blinq([5, 4, 3, 2, 1]).min()).toBe(1)
    expect(
      blinq([5, 4, 3, 2, 1])
        .select(x => repeat(x, 2).toArray())
        .min(([x, _]) => x)
    ).toBe(1)

    expect(blinq([5, 4, 3, 2, 1]).min(x => x, (a, b) => -defaultComparer(a, b))).toBe(5)
  })
  it('defaultComparer', () => {
    expect(defaultComparer(0, 1)).toBe(-1)
    expect(defaultComparer(1, 0)).toBe(1)
    expect(defaultComparer(0, 0)).toBe(0)
  })
  it('identity', () => {
    const src = repeatGenerate(() => Math.random(), 1000)
    src.forEach(x => {
      expect(identity(x)).toBe(x)
    })
    src.forEach(x => {
      const str = x.toString()
      expect(/^-?\d+(\.\d+)?$/.test(str)).toBeTruthy()
      expect(identity(str)).toBe(str)
    })
  })
  it('reverse', () => {
    expect([...blinq([5, 4, 3, 2, 1]).reverse()]).toEqual([1, 2, 3, 4, 5])
  })
  it('sequenceEqual', () => {
    expect(range(0, 3).sequenceEqual([0, 1, 2])).toBeTruthy()
    expect(range(0, 3).sequenceEqual([0, 1, 4])).toBeFalsy()
    expect(range(0, 3).sequenceEqual([0, 1])).toBeFalsy()
    expect(range(0, 2).sequenceEqual([0, 1, 2])).toBeFalsy()
  })
  it('sequenceEqual with comparer', () => {
    expect(range(0, 3).sequenceEqual([0, 1, 2], deepEqualityComparer)).toBeTruthy()
    expect(range(0, 3).sequenceEqual([0, 1, 4], deepEqualityComparer)).toBeFalsy()
    expect(range(0, 3).sequenceEqual([0, 1], deepEqualityComparer)).toBeFalsy()
    expect(range(0, 2).sequenceEqual([0, 1, 2], deepEqualityComparer)).toBeFalsy()
  })
  it('toArray', () => {
    expect(range(0, 2).toArray()).toEqual([0, 1])
  })
  it('toLookup', () => {
    const lookup = range(0, 10).toLookup(x => x % 2)
    expect(lookup.count()).toBe(2)
    expect([...lookup.get(0)]).toEqual([0, 2, 4, 6, 8])
    expect([...lookup.get(1)]).toEqual([1, 3, 5, 7, 9])
  })
  it('toLookup with comparer', () => {
    const lookup = range(0, 10).toLookup(x => x % 2, deepEqualityComparer)
    expect(lookup.count()).toBe(2)
    expect([...lookup.get(0)]).toEqual([0, 2, 4, 6, 8])
    expect([...lookup.get(1)]).toEqual([1, 3, 5, 7, 9])
    const lookup2 = range(0, 10).toLookup(x => x % 2, x => x * 2, deepEqualityComparer)
    expect(lookup2.count()).toBe(2)
    expect([...lookup2.get(0)]).toEqual([0, 4, 8, 12, 16])
    expect([...lookup2.get(1)]).toEqual([2, 6, 10, 14, 18])
  })
  it('toMap', () => {
    const map = range(0, 10).toMap(x => x, x => x / 2)
    expect(map.count()).toBe(10)
    map.forEach(([k, v]) => {
      expect(v).toBe(k / 2)
    })
    expect(map.get(10)).toBeUndefined()
    expect(() => blinq([0, 0]).toMap(x => x, x => x)).toThrow()
    expect(() => range(0, 10).toMap(x => (x / 2) | 0, deepEqualityComparer)).toThrow()
  })
  it('toSet', () => {
    const set = range(0, 10).toSet(x => x)
    expect(set.count()).toBe(10)

    expect(set.has(10)).toBeFalsy()
    expect(() => blinq([1, 1]).toSet(x => x)).toThrow()

    const set2 = range(0, 10).toSet()
    expect(set2.count()).toBe(10)

    expect(set2.has(10)).toBeFalsy()
    const set3 = range(0, 10).toSet(deepEqualityComparer)
    expect(set3.count()).toBe(10)

    expect(set3.has(10)).toBeFalsy()
    expect(() => range(0, 10).toSet(x => (x / 2) | 0, deepEqualityComparer)).toThrow()
  })
  it('groupBy', () => {
    const output = range(0, 2)
      .groupBy(x => x % 2)
      .selectMany(x => x.select(xx => [x.key, xx]))
    expect([...output]).toEqual([[0, 0], [1, 1]])
    expect([...output]).toEqual([[0, 0], [1, 1]])
  })
  it('groupJoin', () => {
    const seq1 = range(0, 5)
    const seq2 = range(3, 5).selectMany(x => repeat(x, 2))
    const joined = seq1.groupJoin(seq2, x => x, x => x, (k, v) => ({ k, v }))
    expect([...joined.select(x => x.k)]).toEqual([0, 1, 2, 3, 4])
    expect([...joined.select(x => x.k)]).toEqual([0, 1, 2, 3, 4])
    expect([...joined.select(x => [...x.v])]).toEqual([[], [], [], [3, 3], [4, 4]])
    expect([...joined.select(x => [...x.v])]).toEqual([[], [], [], [3, 3], [4, 4]])
  })
  it('groupJoin with comparer', () => {
    const seq1 = range(0, 5)
    const seq2 = range(3, 5).selectMany(x => repeat(x, 2))
    const joined = seq1.groupJoin(seq2, x => x, x => x, (k, v) => ({ k, v }), deepEqualityComparer)
    expect([...joined.select(x => x.k)]).toEqual([0, 1, 2, 3, 4])
    expect([...joined.select(x => x.k)]).toEqual([0, 1, 2, 3, 4])
    expect([...joined.select(x => [...x.v])]).toEqual([[], [], [], [3, 3], [4, 4]])
    expect([...joined.select(x => [...x.v])]).toEqual([[], [], [], [3, 3], [4, 4]])
  })
  it('fullOuterGroupJoin', () => {
    const seq1 = range(0, 5).selectMany(x => repeat(x, 2))
    const seq2 = range(1, 5).selectMany(x => repeat(x, 2))
    const gj = seq1.fullOuterGroupJoin(
      seq2,
      x => x,
      x => x,
      (lft, rgt, i) => ({ lft: lft && [...lft], rgt: rgt && [...rgt], i })
    )
    const lookup = gj.toMap(x => x.i, x => x)
    const key0 = lookup.get(0)
    expect(
      key0 && key0.rgt.length === 0 && key0.lft && blinq(key0.lft).sequenceEqual([0, 0])
    ).toBeTruthy()
    const key5 = lookup.get(5)
    expect(
      key5 && key5.lft.length === 0 && key5.rgt && blinq(key5.rgt).sequenceEqual([5, 5])
    ).toBeTruthy()

    const mid = gj
      .skip(1)
      .reverse()
      .skip(1)
      .reverse()

    mid.forEach(x => {
      expect(x.lft).toEqual(x.rgt)
      expect([...repeat(x.i, 2)]).toEqual(x.lft)
    })
  })
  it('fullOuterJoin', () => {
    const seq1 = range(0, 5)
    const seq2 = range(1, 5)
    const j = seq1.fullOuterJoin(seq2, x => x, x => x, (l, r) => ({ l, r }))
    const r1 = j.single(x => x.l === 0)
    expect(typeof r1.r === 'undefined' && r1.l === 0).toBeTruthy()
    const r2 = j.single(x => x.l === 1)
    expect(r2.r === 1 && r2.l === 1).toBeTruthy()
  })

  it('join', () => {
    let outerSeq: Array<{ id: number; value: string }> = [
      {
        id: 1,
        value: 'chris'
      },
      {
        id: 2,
        value: 'andrew'
      },
      {
        id: 4,
        value: 'not relevant'
      }
    ]
    let innerSeq: Array<{ id: number; value: string }> = [
      {
        id: 1,
        value: 'sperry'
      },
      {
        id: 1,
        value: 'pike'
      },
      {
        id: 2,
        value: 'johnson'
      },
      {
        id: 3,
        value: 'not relevant'
      }
    ]

    let items = blinq(outerSeq).join(
      innerSeq,
      outerItem => outerItem.id,
      innerItem => innerItem.id,
      (outerItem, innerItem) => outerItem.value + ' ' + innerItem.value
    )

    expect([...items]).toEqual(['chris sperry', 'chris pike', 'andrew johnson'])
    // expect([...items]).toEqual(["chris sperry", "chris pike", "andrew johnson"]);
  })

  it('leftOuterJoin', () => {
    let outerSeq: Array<{ id: number; value: string }> = [
      {
        id: 1,
        value: 'chris'
      },
      {
        id: 2,
        value: 'andrew'
      },
      {
        id: 4,
        value: 'not relevant'
      }
    ]
    let innerSeq: Array<{ id: number; value: string }> = [
      {
        id: 1,
        value: 'sperry'
      },
      {
        id: 1,
        value: 'pike'
      },
      {
        id: 2,
        value: 'johnson'
      },
      {
        id: 3,
        value: 'not relevant'
      }
    ]

    let items = blinq(outerSeq).leftOuterJoin(
      innerSeq,
      outerItem => outerItem.id,
      innerItem => innerItem.id,
      (outerItem, innerItem) => outerItem.value + ' ' + (innerItem ? innerItem.value : 'no match')
    )

    expect([...items]).toEqual([
      'chris sperry',
      'chris pike',
      'andrew johnson',
      'not relevant no match'
    ])
  })
  it('leftOuterJoin with comparer', () => {
    let outerSeq: Array<{ id: number; value: string }> = [
      {
        id: 1,
        value: 'chris'
      },
      {
        id: 2,
        value: 'andrew'
      },
      {
        id: 4,
        value: 'not relevant'
      }
    ]
    let innerSeq: Array<{ id: number; value: string }> = [
      {
        id: 1,
        value: 'sperry'
      },
      {
        id: 1,
        value: 'pike'
      },
      {
        id: 2,
        value: 'johnson'
      },
      {
        id: 3,
        value: 'not relevant'
      }
    ]

    let items = blinq(outerSeq).leftOuterJoin(
      innerSeq,
      outerItem => outerItem.id,
      innerItem => innerItem.id,
      (outerItem, innerItem) => outerItem.value + ' ' + (innerItem ? innerItem.value : 'no match'),
      deepEqualityComparer
    )

    expect([...items]).toEqual([
      'chris sperry',
      'chris pike',
      'andrew johnson',
      'not relevant no match'
    ])
  })

  it('skip', () => {
    expect([...blinq([1, 2, 3]).skip(1)]).toEqual([2, 3])
  })
  it('skipWhile', () => {
    expect([...blinq([1, 2, 3, 4, 1, 5]).skipWhile(x => x < 3)]).toEqual([3, 4, 1, 5])
  })
  it('take', () => {
    expect([...blinq([1, 2, 3]).take(2)]).toEqual([1, 2])
  })
  it('sum', () => {
    expect(blinq([1, 2, 3]).sum()).toEqual(6)
  })
  it('union', () => {
    const u = range(0, 10).union(range(5, 10))
    expect([...u]).toEqual([...range(0, 15)])
  })
  it('zip', () => {
    expect(
      blinq([1, 2])
        .zip([2, 1], (a, b) => [a, b])
        .toArray()
    ).toEqual([[1, 2], [2, 1]])
    expect(
      blinq([1, 2])
        .zip([2, 1, 5], (a, b) => [a, b])
        .toArray()
    ).toEqual([[1, 2], [2, 1]])
    expect(
      blinq([1, 2, 5])
        .zip([2, 1], (a, b) => [a, b])
        .toArray()
    ).toEqual([[1, 2], [2, 1]])
  })
  it('maxBy, minBy', () => {
    interface Person {
      name: string
      age: number
    }
    const arr: Person[] = [
      { name: 'chris', age: 44 },
      { name: 'nicole', age: 48 },
      { name: 'pav', age: 45 },
      { name: 'luke', age: 41 }
    ]
    expect(
      blinq(arr)
        .maxBy(x => x.age)
        .first().name
    ).toBe('nicole')
    expect(
      blinq(arr)
        .minBy(x => x.age)
        .first().name
    ).toBe('luke')
    expect(() =>
      blinq(arr)
        .take(0)
        .minBy(x => x.age)
    ).toThrow()
    expect(
      blinq([0, 0])
        .minBy(x => x)
        .toArray()
    ).toEqual([0, 0])
    expect(
      blinq([0, 0])
        .maxBy(x => x)
        .toArray()
    ).toEqual([0, 0])
    const inverseComparer = <T>(a: T, b: T) => defaultComparer(b, a)
    expect(
      blinq(arr)
        .maxBy(x => x.age, inverseComparer)
        .first().name
    ).toBe('luke')
    expect(
      blinq(arr)
        .minBy(x => x.age, inverseComparer)
        .first().name
    ).toBe('nicole')
  })
  it('append', () => {
    expect(
      blinq([1, 2])
        .append(3)
        .toArray()
    ).toEqual([1, 2, 3])
  })
  it('prepend', () => {
    expect(
      blinq([1, 2])
        .prepend(3)
        .toArray()
    ).toEqual([3, 1, 2])
  })
  it('flatten', () => {
    expect(
      blinq([1, 2])
        .select(x => repeat(x, 2))
        .flatten()
        .toArray()
    ).toEqual([1, 1, 2, 2])
  })
  it('zipAll', () => {
    const b = blinq([blinq([1, 2]), blinq([1, 2, 3])])

    expect(
      b
        .zipAll()
        .select(x => x.toArray())
        .toArray()
    ).toEqual([[1, 1], [2, 2]])

    const c = empty<Enumerable<number>>()
    expect([...c]).toEqual([])
  })
  it('groupAdjacent', () => {
    expect(
      blinq([1, 1, 2, 2, 2, 3, 3, 3, 3, 2, 2])
        .groupAdjacent(x => x, x => x, (key, items) => items.toArray())
        .toArray()
    ).toEqual([[1, 1], [2, 2, 2], [3, 3, 3, 3], [2, 2]])
  })
  it('groupAdjacent with comparer', () => {
    expect(
      blinq([1, 1, 2, 2, 2, 3, 3, 3, 3, 2, 2])
        .groupAdjacent(x => x, x => x, (key, items) => items.toArray(), deepEqualityComparer)
        .toArray()
    ).toEqual([[1, 1], [2, 2, 2], [3, 3, 3, 3], [2, 2]])
  })
})
