import { hashString } from './hashString'
import { hashObject } from './hashObject'
import { hashSequence } from './hashSequence'
import { hashNumber } from './hashNumber'
import { hashBoolean } from './hashBoolean'
import { getObjectId } from '../util/getObjectId'

export const hash = (value: any, visited?: Set<number>): number => {
  const visitedSet = visited || new Set<number>()
  const type = typeof value
  switch (type) {
    case 'string':
      return hashString(value)
    case 'number':
      return hashNumber(value)
    case 'boolean':
      return hashBoolean(value)
    case 'undefined':
      return 683831609
  }
  if (type === 'object') {
    if (value === null) {
      return 3630146161
    }
    const oid = getObjectId(value)
    if (visitedSet.has(oid!)) {
      throw Error('circular')
    }
    visitedSet.add(oid!)
    if (value[Symbol.iterator]) {
      return hashSequence(value, visitedSet, hash)
    }
    return hashObject(value, visitedSet, hash)
  }

  throw Error('not supported')
}
