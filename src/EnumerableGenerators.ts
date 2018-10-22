import { Enumerable } from './Enumerable'
import GeneratorIterable from './GeneratorIterable'
export function empty<T>(): Enumerable<T> {
  return fromIterable<T>([])
}

export function fromGenerator<T>(gen: () => Iterable<T>): Enumerable<T> {
  return new GeneratorIterable<T>(function*() {
    const it = gen()
    for (const x of it) {
      yield x
    }
  })
}

export function fromIterable<T>(value: Iterable<T>): Enumerable<T> {
  return fromGenerator(function*() {
    for (const x of value) {
      yield x
    }
  })
}

export function fromSingleValue<T>(value: T): Enumerable<T> {
  return fromGenerator(function*() {
    yield value
  })
}

export function range(start: number, range: number): Enumerable<number> {
  if (Math.trunc(start) !== start) {
    throw Error('start must be an integral value')
  }
  if (Math.trunc(range) !== range) {
    throw Error('range must be an integral value')
  }
  if (range < 0) {
    throw Error('range must be >= 0')
  }
  return fromGenerator(function*() {
    for (let i = 0; i < range; ++i) {
      yield i + start
    }
  })
}

export function repeat<T>(item: T, numRepeats: number): Enumerable<T> {
  return range(0, numRepeats).select(() => item)
}

export function repeatGenerate<T>(generator: (i: number) => T, numRepeats: number): Enumerable<T> {
  return range(0, numRepeats).select(i => generator(i))
}
