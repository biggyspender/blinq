let seed = 737245463
export const hashString = (value: string) =>
  value.length === 0
    ? seed
    : value.split('').reduce((hash, curr) => ((hash << 5) - hash + curr.charCodeAt(0)) | 0, seed)
