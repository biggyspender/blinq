import { entries } from '../util/entries'
import { hashString } from './hashString'
import { HashFunc } from './HashFunc'
import { defaultSortMethod } from '../util/defaultSortMethod'
const _hashObject = <T>(obj: T, visited: Set<number>, hash: HashFunc) => {
  return obj === null
    ? 3630146161
    : entries(obj)
        .sort(([a], [b]) => defaultSortMethod(a, b))
        .reduce(
          (prev, [key, val]) =>
            Math.imul(Math.imul(prev, 397) ^ hashString(key), 397) ^ hash(val, visited),
          2066111009
        )
}

export const hashObject = _hashObject
// (() => {
//     const map = new WeakMap<{}, number>();
//     return (value: {}, visited: Set<number>, hash: HashFunc) => {
//         if (!map.has(value)) {
//             const h = _hashObject(value, visited, hash);
//             map.set(value, h);
//             return h;
//         }
//         return (map.get(value))!;
//     };
// })();
