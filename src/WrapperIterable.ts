import GeneratorIterable from './GeneratorIterable'
export default class WrapperIterable<T> extends GeneratorIterable<T> {
  constructor(it: Iterable<T>) {
    /* istanbul ignore next */
    {
      super(function*() {
        for (const x of it) {
          yield x
        }
      })
    }
  }
}
