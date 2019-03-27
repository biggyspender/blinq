import { createComparerMap } from '../src/createComparerMap'
import { deepEqualityComparer } from '../src/comparer/deepEqualityComparer'
import { range, blinq } from '../src/blinq'
import { hashNumber } from '../src/hashing/hashNumber'
import { defaultSortMethod } from '../src/util/defaultSortMethod'
import { HashTable } from '../src/hash-table/HashTable'
const lipsum =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque consequat vitae felis at venenatis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus a scelerisque quam. Nunc consequat felis libero. Fusce feugiat neque lacus. Nullam nec ex ipsum. Fusce maximus justo metus, eu elementum nisl scelerisque quis. Quisque sit amet tincidunt dui, vitae porta orci. Cras pharetra volutpat odio facilisis pulvinar. Vivamus id mi efficitur, accumsan lacus eu, egestas diam. Curabitur mi est, eleifend ac risus a, feugiat efficitur leo.'
describe('hashtable', () => {
  it('works deep', () => {
    const ht = createComparerMap<string, number>(0, deepEqualityComparer)
    ht.set('foo', 1)
    ht.set('foo', 1)
    expect(ht.get('foo')).toBe(1)
    expect(ht.get('woo')).toBe(undefined)
  })
  it('works', () => {
    const ht = createComparerMap<string, number>(0)
    ht.set('foo', 1)
    ht.set('foo', 1)
    expect(ht.get('foo')).toBe(1)
    expect(ht.get('woo')).toBe(undefined)
  })
  it('can be thrashed deep', () => {
    const ht = createComparerMap<{ a: { b: number } }, number>(0, deepEqualityComparer)
    const numItems = 100
    const s1 = process.hrtime()
    range(0, numItems).forEach(i => ht.set({ a: { b: i } }, i))
    const t1 = process.hrtime(s1)
    const s2 = process.hrtime()
    expect(range(0, numItems).all(i => ht.get({ a: { b: i } }) === i)).toBeTruthy()
    const t2 = process.hrtime(s2)
    // console.info('Execution time (hr): %ds %dms', t1[0], t1[1] / 1000000);
    // console.info('Execution time (hr): %ds %dms', t2[0], t2[1] / 1000000);
    // console.log(ht.toString!());
  })
  it('can be thrashed', () => {
    const ht = createComparerMap<number, number>()
    const numItems = 1000
    const s1 = process.hrtime()
    range(0, numItems).forEach(i => ht.set(i, i))
    const t1 = process.hrtime(s1)
    const s2 = process.hrtime()
    expect(range(0, numItems).all(i => ht.get(i) === i)).toBeTruthy()
    const t2 = process.hrtime(s2)
    // console.info('Execution time (hr): %ds %dms', t1[0], t1[1] / 1000000);
    // console.info('Execution time (hr): %ds %dms', t2[0], t2[1] / 1000000);
    // console.log(ht.toString!());
  })
  it('can be thrashed', () => {
    const ht = createComparerMap<{}, number>()

    const numItems = 1000
    const keys = range(0, numItems)
      .select(x => ({}))
      .toArray()
    const s1 = process.hrtime()
    blinq(keys).forEach((k, i) => ht.set(k, i))
    const t1 = process.hrtime(s1)
    const s2 = process.hrtime()
    expect(blinq(keys).all((k, i) => ht.get(k) === i)).toBeTruthy()
    const t2 = process.hrtime(s2)
    // console.info('Execution time (hr): %ds %dms', t1[0], t1[1] / 1000000);
    // console.info('Execution time (hr): %ds %dms', t2[0], t2[1] / 1000000);
    // console.log(ht.toString!());
  })
  it('distributes nicely', () => {
    const ht = createComparerMap<string, string>(0, deepEqualityComparer) as HashTable<
      string,
      string
    >
    for (const v of range(0, lipsum.length).select(r => rotateStringLeft(lipsum, r))) {
      ht.set(v, v)
    }
    expect(blinq(ht.buckets).count(b => b == null)).toBeLessThan(ht.buckets.length / 3)
  })
  it('works with custom hasher', () => {
    const ht = createComparerMap<{ a: number; b: string }, string>(0, {
      equals: (a, b) => a.a === b.a,
      getHashCode: x => hashNumber(x.a)
    })
    expect(() => ht.set({ a: 0, b: 'hello' }, 'woo')).not.toThrow()
    expect(() => ht.set({ a: 1, b: 'hello' }, 'woo')).not.toThrow()
    expect(() => ht.set({ a: 0, b: 'hello' }, 'woo')).not.toThrow()
  })
  it('thrashes with custom hasher', () => {
    const ht = createComparerMap<{ a: number; b: string }, string>(0, {
      equals: (a, b) => a.a === b.a,
      getHashCode: x => hashNumber(x.a)
    })
    const s1 = process.hrtime()
    range(0, 10000).forEach(i => ht.set({ a: i, b: 'woo' }, `woo`))
    const t1 = process.hrtime(s1)
    const s2 = process.hrtime()
    expect(range(0, 1000).all(i => ht.get({ a: i, b: 'goo' }) === `woo`)).toBeTruthy()
    const t2 = process.hrtime(s2)
    // console.info('Execution time (hr): %ds %dms', t1[0], t1[1] / 1000000);
    // console.info('Execution time (hr): %ds %dms', t2[0], t2[1] / 1000000);
    // console.log(ht.toString!());
  })
  it('has', () => {
    const ht = createComparerMap<{ a: number; b: string }, string>(0, {
      equals: (a, b) => a.a === b.a,
      getHashCode: x => hashNumber(x.a)
    })
    expect(ht.has({ a: 1000, b: 'd' })).toBeFalsy()

    range(0, 1000).forEach(i => ht.set({ a: i, b: 'woo' }, `woo`))
    expect(ht.has({ a: 0, b: '' })).toBeTruthy()
    expect(ht.has({ a: 0, b: 'd' })).toBeTruthy()
    expect(ht.has({ a: 1000, b: 'd' })).toBeFalsy()
    expect(ht.has({ a: 999, b: 'd' })).toBeTruthy()
  })
  it('get', () => {
    const ht = createComparerMap<{ a: number; b: string }, string>(0, {
      equals: (a, b) => a.a === b.a,
      getHashCode: x => hashNumber(x.a)
    })
    expect(ht.get({ a: 1000, b: 'd' })).toBeUndefined()

    range(0, 1000).forEach(i => ht.set({ a: i, b: 'woo' }, `woo`))
    expect(ht.get({ a: 0, b: '' })).toBeDefined()
    expect(ht.get({ a: 0, b: 'd' })).toBeDefined()
    expect(ht.get({ a: 1000, b: 'd' })).toBeUndefined()
    expect(ht.get({ a: 999, b: 'd' })).toBeDefined()
  })
  it('entries', () => {
    const ht = createComparerMap<number, number>(0, {
      equals: (a, b) => a === b,
      getHashCode: hashNumber
    })
    range(0, 1000).forEach(i => ht.set(i, i))
    expect(
      blinq(ht.entries())
        .orderBy(([k, v]) => k)
        .toArray()
    ).toEqual(
      range(0, 1000)
        .select(i => [i, i])
        .toArray()
    )
  })
  it('bound forEach', () => {
    const ht = createComparerMap<number, number>(0, {
      equals: (a, b) => a === b,
      getHashCode: hashNumber
    })
    range(0, 1000).forEach(i => ht.set(i, i))
    const a: [number, number, Map<number, number>, any][] = []
    const thisObj = {}
    ht.forEach(function(this: any, v, k, m) {
      a.push([v, k, m, this])
    }, thisObj)

    expect(blinq(a).all(([k, v, m, t]) => k === v && m === ht && t === thisObj)).toBeTruthy()
    expect(
      blinq(a)
        .select(([k]) => k)
        .orderBy(k => k)
        .sequenceEqual(range(0, 1000))
    ).toBeTruthy()
  })
  it('unbound forEach', () => {
    const ht = createComparerMap<number, number>(0, {
      equals: (a, b) => a === b,
      getHashCode: hashNumber
    })
    range(0, 1000).forEach(i => ht.set(i, i))
    const a: [number, number, Map<number, number>][] = []
    ht.forEach(function(this: any, v, k, m) {
      a.push([v, k, m])
    })

    expect(blinq(a).all(([k, v, m]) => k === v && m === ht)).toBeTruthy()
    expect(
      blinq(a)
        .select(([k]) => k)
        .orderBy(k => k)
        .sequenceEqual(range(0, 1000))
    ).toBeTruthy()
  })
  it('keys', () => {
    const ht = createComparerMap<number, number>(0, {
      equals: (a, b) => a === b,
      getHashCode: hashNumber
    })
    range(0, 1000).forEach(i => ht.set(i, i))
    expect(
      blinq(ht.keys())
        .orderBy(k => k)
        .toArray()
    ).toEqual(
      range(0, 1000)
        .select(i => i)
        .toArray()
    )
  })
  it('delete', () => {
    const ht = createComparerMap<number, number>(0, {
      equals: (a, b) => a === b,
      getHashCode: hashNumber
    })
    expect(ht.delete(1)).toBeFalsy()
    range(0, 1000).forEach(i => ht.set(i, i))
    expect(ht.size).toBe(1000)
    expect(ht.delete(1)).toBeTruthy()
    expect(ht.size).toBe(999)
    expect(ht.delete(1)).toBeFalsy()
    expect(ht.size).toBe(999)
  })
  it('clear', () => {
    const ht = createComparerMap<number, number>(0, {
      equals: (a, b) => a === b,
      getHashCode: hashNumber
    })

    range(0, 1000).forEach(i => ht.set(i, i))
    expect(ht.has(1)).toBeTruthy()
    expect(ht.size).toBe(1000)
    ht.clear()
    expect(ht.has(1)).toBeFalsy()
    expect(ht.size).toBe(0)
  })
  it('values', () => {
    const ht = createComparerMap<number, number>(0, {
      equals: (a, b) => a === b,
      getHashCode: hashNumber
    })
    range(0, 1000).forEach(i => ht.set(i, i))
    expect(
      blinq(ht.values())
        .orderBy(v => v)
        .toArray()
    ).toEqual(
      range(0, 1000)
        .select(i => i)
        .toArray()
    )
  })
  it('symbol iterator', () => {
    const ht = createComparerMap<number, number>(0, {
      equals: (a, b) => a === b,
      getHashCode: hashNumber
    })
    range(0, 1000).forEach(i => ht.set(i, i))
    expect([...ht[Symbol.iterator]()]).toEqual([...ht.entries()])
  })
  it('size', () => {
    const ht = createComparerMap<number, number>(0, {
      equals: (a, b) => a === b,
      getHashCode: hashNumber
    })
    for (let i = 0; i < 100; ++i) {
      expect(ht.size).toBe(i)
      ht.set(i, i)
    }
  })
  it('enumerates in insert order', () => {
    const ht = createComparerMap<number, number>(0, {
      equals: (a, b) => a === b,
      getHashCode: hashNumber
    })
    const numItems = 1000
    range(0, numItems).forEach(i => ht.set(i, i))
    expect(blinq(ht.values()).sequenceEqual(range(0, numItems))).toBeTruthy()
    expect(blinq(ht.keys()).sequenceEqual(range(0, numItems))).toBeTruthy()
    expect(
      blinq(ht.entries())
        .select(([x]) => x)
        .sequenceEqual(range(0, numItems))
    ).toBeTruthy()
    expect(
      blinq(ht[Symbol.iterator]())
        .select(([x]) => x)
        .sequenceEqual(range(0, numItems))
    ).toBeTruthy()
  })
})
describe('defaultSortMethod', () => {
  it('works', () => {
    expect(defaultSortMethod(2, 1)).toBeGreaterThan(0)
    expect(defaultSortMethod(1, 2)).toBeLessThan(0)
    expect(defaultSortMethod(1, 1)).toBe(0)
  })
})
describe('rotateString', () => {
  it('rotates left', () => {
    expect(rotateStringLeft('hello', 2)).toBe('llohe')
  })
  it('rotates right', () => {
    expect(rotateStringRight('hello', 2)).toBe('lohel')
  })
})
const rotateStringLeft = (v: string, amt: number) => {
  const r = ((amt % v.length) + v.length) % v.length
  return `${v.substr(r)}${v.substr(0, r)}`
}
const rotateStringRight = (v: string, amt: number) => rotateStringLeft(v, -amt)
