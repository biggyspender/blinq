import { Enumerable, getDefaultComparer, getIdentity } from './Enumerable'
import './extensions/all'
import './extensions/any'
import './extensions/append'
import './extensions/average'
import './extensions/concat'
import './extensions/count'
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
import './extensions/intersect'
import './extensions/isSubsetOf'
import './extensions/isSupersetOf'
import './extensions/last'
import './extensions/lastOrDefault'
import './extensions/max'
import './extensions/maxBy'
import './extensions/min'
import './extensions/minBy'
import './extensions/sum'

function blinq<T>(it: Iterable<T>) {
  return Enumerable.fromIterable(it)
}
/* istanbul ignore next */
namespace blinq {
  export const empty = Enumerable.empty
  export const fromGenerator = Enumerable.fromGenerator
  export const fromSingleValue = Enumerable.fromSingleValue
  export const range = Enumerable.range
  export const repeatGenerate = Enumerable.repeatGenerate
  export const repeat = Enumerable.repeat
  export const defaultComparer = getDefaultComparer()
  export const identity = getIdentity()
}

export default blinq
