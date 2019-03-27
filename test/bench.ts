import { performance } from 'perf_hooks'

export const bench = (numRepeats: number, action: () => void) => {
  const t1 = performance.now()
  for (let i = 0; i < numRepeats; ++i) {
    action()
  }
  const t2 = performance.now()
  return t2 - t1
}
