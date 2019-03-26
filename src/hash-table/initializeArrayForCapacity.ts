import { blinq } from '../blinq'
import { primes } from '../math/primes'
export const initializeArrayForCapacity = <T>(capacity: number) => {
  const actualCapacity = blinq(primes).first(p => p > capacity)
  // console.log(`cap : ${capacity}, actual cap : ${actualCapacity}`)
  // range(0, actualCapacity).select(_ => [] as KeyValuePair<TKey, TValue>[]).forEach(v => buckets.push(v))
  return new Array<T>(actualCapacity)
}
