import { blinq } from '../blinq'
import { entries } from '../util/entries'
export const deepEqual = (obj1: any, obj2: any): boolean => {
  const tObj1 = typeof obj1
  const tObj2 = typeof obj2
  if (tObj1 !== tObj2) {
    return false
  }
  if (tObj1 === 'undefined') {
    return true
  }
  if (tObj1 !== 'object') {
    return obj1 === obj2
  }
  if (obj1[Symbol.iterator] && obj2[Symbol.iterator]) {
    return blinq(obj1 as Iterable<any>)
      .zip(obj2 as Iterable<any>, (o1, o2) => [o1, o2])
      .all(([o1, o2]) => deepEqual(o1, o2))
  }
  if (obj1[Symbol.iterator] ? !obj2[Symbol.iterator] : !!obj2[Symbol.iterator]) {
    return false
  }
  const entries1 = entries(obj1)
  const entries2 = entries(obj2)

  /* istanbul ignore next */
  const sortFunc: (a: [string, {}], b: [string, {}]) => number = ([k1], [k2]) =>
    k1 > k2 ? 1 : k1 < k2 ? -1 : 0
  entries1.sort(sortFunc)
  entries2.sort(sortFunc)

  return (
    entries1.length === entries2.length &&
    blinq(entries1)
      .zip(entries2, (e1, e2) => [e1, e2])
      .all(([[k1, v1], [k2, v2]]) => k1 === k2 && deepEqual(v1, v2))
  )
}
