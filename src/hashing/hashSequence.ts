import { HashFunc } from './HashFunc'

export const hashSequence = <T>(items: Iterable<T>, visited: Set<number>, hash: HashFunc): number =>
  [...items].reduce((hashcode, curr) => Math.imul(hashcode, 31) + hash(curr, visited), 1)
