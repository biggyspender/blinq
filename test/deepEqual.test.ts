import { deepEqual } from '../src/comparer/deepEqual'
describe('deepEqual', () => {
  it('returns false on disparate types', () => {
    expect(deepEqual(1, '')).toBeFalsy()
  })
  it('compares primitive types', () => {
    expect(deepEqual('a', 'a')).toBeTruthy()
    expect(deepEqual('a', 'b')).toBeFalsy()
    expect(deepEqual(11, 11)).toBeTruthy()
    expect(deepEqual(11, 12)).toBeFalsy()
    expect(deepEqual(true, true)).toBeTruthy()
    expect(deepEqual(false, false)).toBeTruthy()
    expect(deepEqual(true, false)).toBeFalsy()
    expect(deepEqual(false, true)).toBeFalsy()
  })
  it('compares sequences', () => {
    expect(deepEqual([1, 2], [1, 2])).toBeTruthy()
    expect(deepEqual([1], [1, 2])).toBeFalsy()
    expect(deepEqual([], [])).toBeTruthy()
    expect(deepEqual([1, 2], [1, 3])).toBeFalsy()
  })
  it('differentiates between iterable and object', () => {
    expect(deepEqual([1, 2], {})).toBeFalsy()
  })
  it('works with objects', () => {
    expect(deepEqual({}, {})).toBeTruthy()
    expect(deepEqual({ a: 1 }, { a: 1 })).toBeTruthy()
    expect(deepEqual({ a: 1 }, { a: 2 })).toBeFalsy()
    expect(deepEqual({ b: 1 }, { a: 1 })).toBeFalsy()
    expect(deepEqual({ b: 1, c: 2 }, { a: 1 })).toBeFalsy()
  })
  it('works recursively', () => {
    expect(deepEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBeTruthy()
    expect(deepEqual({ a: { b: 1 } }, { a: { b: 2 } })).toBeFalsy()
    expect(deepEqual([{ b: 1 }], [{ b: 1 }])).toBeTruthy()
    expect(deepEqual([{ b: 1 }], [{ b: 2 }])).toBeFalsy()
    expect(deepEqual([{ b: 1 }, { c: 1 }], [{ b: 1 }, { c: 1 }])).toBeTruthy()
    expect(deepEqual([{ b: 1 }, { c: 1 }], [{ b: 1 }, { c: 2 }])).toBeFalsy()
    expect(deepEqual([{ b: 1 }, { c: [true] }], [{ b: 1 }, { c: [true] }])).toBeTruthy()
    expect(deepEqual([{ b: 1 }, { c: [true] }], [{ b: 1 }, { c: [false] }])).toBeFalsy()
  })
  it('works with undefined', () => {
    expect(deepEqual(undefined, undefined)).toBeTruthy()
  })
})
