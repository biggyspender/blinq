import { hash } from '../hashing/hash'
import { deepEqual } from './deepEqual'
import { EqualityComparer } from './EqualityComparer'

export const deepEqualityComparer: EqualityComparer<any> = {
  equals: deepEqual,
  getHashCode: hash
}
