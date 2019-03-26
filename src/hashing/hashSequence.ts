import { blinq } from '../blinq'
import { HashFunc } from './HashFunc'

export const hashSequence = <T>(items: Iterable<T>, visited: Set<number>, hash: HashFunc): number =>
  blinq(items).aggregate(1, (hashcode, curr) => Math.imul(hashcode, 31) + hash(curr, visited))
