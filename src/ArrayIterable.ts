import GeneratorIterable from './GeneratorIterable'
export default class ArrayIterable<T> extends GeneratorIterable<T> {
  // @propertyIsEnumerable(false)
  private _underlyingArray: T[]

  constructor(arr: Array<T>) {
    /* istanbul ignore next */
    {
      super(function*() {
        for (const x of arr) {
          yield x
        }
      })
    }
    this._underlyingArray = arr
  }
  public push(item: T) {
    this._underlyingArray.push(item)
  }
}
