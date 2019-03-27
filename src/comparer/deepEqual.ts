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
    const a1 = [...obj1]
    const a2 = [...obj2]
    if (a1.length !== a2.length) {
      return false
    }
    for (let i = 0; i < a1.length; ++i) {
      const o1 = a1[i]
      const o2 = a2[i]
      if (!deepEqual(o1, o2)) {
        return false
      }
    }
    return true
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

  if (entries1.length !== entries2.length) {
    return false
  }
  for (let i = 0; i < entries1.length; ++i) {
    const [k1, v1] = entries1[i]
    const [k2, v2] = entries2[i]
    if (k1 !== k2 || !deepEqual(v1, v2)) {
      return false
    }
  }

  return true
}
