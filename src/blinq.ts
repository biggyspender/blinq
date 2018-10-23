import { Enumerable } from './Enumerable'
import * as EnumerableGenerators from './EnumerableGenerators'
import getIdentity from './getIdentity'
import getDefaultComparer from './getDefaultComparer'

import './extensions/aggregate'
import './extensions/all'
import './extensions/any'
import './extensions/append'
import './extensions/average'
import './extensions/concat'
import './extensions/count'
import './extensions/defaultIfEmpty'
import './extensions/distinct'
import './extensions/distinctBy'
import './extensions/elementAt'
import './extensions/except'
import './extensions/first'
import './extensions/firstOrDefault'
import './extensions/forEach'
import './extensions/flatten'
import './extensions/fullOuterJoin'
import './extensions/fullOuterGroupJoin'
import './extensions/groupAdjacent'
import './extensions/groupBy'
import './extensions/groupJoin'
import './extensions/intersect'
import './extensions/isSubsetOf'
import './extensions/isSupersetOf'
import './extensions/join'
import './extensions/last'
import './extensions/lastOrDefault'
import './extensions/leftOuterJoin'
import './extensions/max'
import './extensions/maxBy'
import './extensions/min'
import './extensions/minBy'
import './extensions/orderBy'
import './extensions/orderByDescending'
import './extensions/preprend'
import './extensions/reverse'
import './extensions/select'
import './extensions/selectMany'
import './extensions/sequenceEqual'
import './extensions/single'
import './extensions/singleOrDefault'
import './extensions/skip'
import './extensions/skipWhile'
import './extensions/sum'
import './extensions/take'
import './extensions/takeWhile'
import './extensions/toArray'
import './extensions/toLookup'
import './extensions/toMap'
import './extensions/union'
import './extensions/where'
import './extensions/zip'
import './extensions/zipAll'

function blinq<T>(it: Iterable<T>) {
  return EnumerableGenerators.fromIterable(it)
}
/* istanbul ignore next */
namespace blinq {
  export const empty = EnumerableGenerators.empty
  export const fromGenerator = EnumerableGenerators.fromGenerator
  export const fromSingleValue = EnumerableGenerators.fromSingleValue
  export const range = EnumerableGenerators.range
  export const repeatGenerate = EnumerableGenerators.repeatGenerate
  export const repeat = EnumerableGenerators.repeat
  export const defaultComparer = getDefaultComparer()
  export const identity = getIdentity()
}

export default blinq
