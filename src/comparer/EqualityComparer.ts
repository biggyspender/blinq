export interface EqualityComparer<T> {
  getHashCode: (value: T) => number
  equals: (a: T, b: T) => boolean
}
