import { primes } from '../math/primes'
export const initializeArrayForCapacity = <T>(capacity: number) => {
  for (const p of primes) {
    if (p >= capacity) {
      return new Array<T>(p)
    }
  }
  /* istanbul ignore next */
  throw Error('too large')
}
