import { createComparerSet } from '../src/createComparerSet'
import { deepComparer } from '../src/comparer/deepComparer'
import { range } from '../src/EnumerableGenerators'
import { blinq } from '../src/blinq'

describe('createComparerSet', () => {
  it('works', () => {
    const testSet = (set: Set<number>) => {
      expect(set.size).toBe(0)
      set.add(1)
      expect(set.has(1)).toBeTruthy()
      expect(set.has(0)).not.toBeTruthy()
      expect(set.size).toBe(1)
      set.add(1)
      expect(set.size).toBe(1)
      expect(set.delete(0)).toBeFalsy()
      expect(set.size).toBe(1)
      expect(set.delete(1)).toBeTruthy()
      expect(set.size).toBe(0)
      expect(set.delete(1)).toBeFalsy()

      range(0, 1000).forEach(x => set.add((x / 2) | 0))
      expect(set.size).toBe(500)
      expect(
        blinq(set.entries())
          .select(([k]) => k)
          .sequenceEqual(range(0, 500))
      ).toBeTruthy()
      expect(
        blinq(set.entries())
          .select(([, v]) => v)
          .sequenceEqual(range(0, 500))
      ).toBeTruthy()
      expect(blinq(set[Symbol.iterator]()).sequenceEqual(range(0, 500))).toBeTruthy()
      expect(blinq(set.keys()).sequenceEqual(range(0, 500))).toBeTruthy()
      expect(blinq(set.values()).sequenceEqual(range(0, 500))).toBeTruthy()
      const aaa: number[] = []
      set.forEach(k => aaa.push(k))
      expect(blinq(aaa).sequenceEqual(range(0, 500))).toBeTruthy()
      set.clear()
      expect(set.size).toBe(0)
    }
    testSet(createComparerSet<number>(0, deepComparer))
    testSet(createComparerSet<number>())
  })
})
