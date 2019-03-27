import { IndexedSelector } from '../IndexedSelector'
export const isIndexedSelector = <T, TKey>(f: any): f is IndexedSelector<T, TKey> =>
  typeof f === 'function'
