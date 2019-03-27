export interface EqualityComparer<T> {
  getHashCode: (value: T) => number
  equals: (a: T, b: T) => boolean
}
/* istanbul ignore next */
export const isEqualityComparer = <T>(obj: any): obj is EqualityComparer<T> =>
  obj != null &&
  typeof (obj as EqualityComparer<T>).equals === 'function' &&
  typeof (obj as EqualityComparer<T>).getHashCode === 'function'
