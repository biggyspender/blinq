import { hash } from '../src/hashing/hash'
import { hashSequence } from '../src/hashing/hashSequence'

describe('hashSequence', () => {
  it('hashes', () => {
    const seq = ['a', 1, true, { a: 3 }]
    const h1 = hashSequence(seq, new Set<number>(), hash)
    const h2 = hashSequence(seq, new Set<number>(), hash)
    expect(h1).toBe(h2)
  })
})
