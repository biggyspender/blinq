import { Enumerable, getDefaultComparer, getIdentity } from './Enumerable'

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
