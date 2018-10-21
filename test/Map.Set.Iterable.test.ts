import { MapIterable, SetIterable } from '../src/Enumerable'
import blinq from '../src/blinq'

describe('set/map Iterables', () => {
  it('MapIterable', () => {
    const map: Map<string, number> = new Map()
    map.set('one', 1)
    map.set('two', 2)
    const mapIter = new MapIterable(map)
    expect([...mapIter.keys()]).toEqual(['one', 'two'])
    expect([...mapIter.values()]).toEqual([1, 2])
    expect([...mapIter]).toEqual([['one', 1], ['two', 2]])
    expect([...mapIter.entries()]).toEqual([['one', 1], ['two', 2]])
    expect([...mapIter.where(([_, v]) => v > 1)]).toEqual([['two', 2]])
    expect(mapIter.convertToObject()).toEqual({ one: 1, two: 2 })
    expect(mapIter.has('one')).toBeTruthy()
    expect(mapIter.has('onee')).toBeFalsy()
  })
  it('SetIterable', () => {
    const set: Set<number> = new Set(blinq.range(0, 2))

    const setIter = new SetIterable(set)

    expect([...setIter.values()]).toEqual([0, 1])
    expect([...setIter]).toEqual([0, 1])
    expect([...setIter.entries()]).toEqual([[0, 0], [1, 1]])
    expect(setIter.has(1)).toBeTruthy()
    expect(setIter.has(2)).toBeFalsy()
  })
})
