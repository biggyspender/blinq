export interface EqualityComparer<T> {
  getHashCode: (value: T) => number
  equals: (a: T, b: T) => boolean
}
/* istanbul ignore next */
export const isEqualityComparer = <T>(obj: any): obj is EqualityComparer<T> =>
  obj != null && typeof obj.equals === 'function' && typeof obj.getHashCode === 'function'
