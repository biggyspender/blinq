import { hash } from '../hashing/hash'
import { deepEqual } from './deepEqual'
import { EqualityComparer } from './EqualityComparer'

export const deepComparer: EqualityComparer<any> = {
  equals: deepEqual,
  getHashCode: hash
}
