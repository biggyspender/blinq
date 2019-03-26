import { hashString } from '../src/hashing/hashString'
import { hash } from '../src/hashing/hash'
import { hashObject } from '../src/hashing/hashObject'

describe('hashString', () => {
  it('hashes', () => {
    const v = 'hello world!'
    const vv = 'goodbye world!'
    const h = hashString(v)
    const hh = hashString(vv)
    expect(h).not.toBe(hh)

    const o = { a: [2, 3, 4, true, ''], b: 'foodie', c: undefined }
    expect(() => hash(o)).not.toThrow()

    expect(() =>
      hash(function(): void {
        return
      })
    ).toThrow()
  })
  it('throws on circular ref', () => {
    const a: any = []
    a.push(a)
    expect(() => hash(a)).toThrow()
  })
  it('works with null', () => {
    expect(() => hash(null)).not.toThrow()
    expect(() => hashObject(null, new Set<number>(), hash)).not.toThrow()
    expect(hash(null)).toBe(hashObject(null, new Set<number>(), hash))
  })
  it('works with different ordering', () => {
    expect(hash({ a: 1, b: 2, c: 3 })).toBe(hash({ b: 2, a: 1, c: 3 }))
    expect(hash({ a: 1, b: 2, c: 3 })).toBe(hash({ c: 3, a: 1, b: 2 }))
  })
})
