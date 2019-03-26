import { blinq } from '../blinq'

let seed = 737245463
export const hashString = (value: string) =>
  value.length === 0
    ? seed
    : blinq(value).aggregate(seed, (hash, curr) => ((hash << 5) - hash + curr.charCodeAt(0)) | 0)
