import WrapperIterable from './WrapperIterable'
export default class SetIterable<T> extends WrapperIterable<T> {
  private _underlyingSet: Set<T>

  constructor(set: Set<T>) {
    /* istanbul ignore next */
    {
      super(set)
    }
    this._underlyingSet = set
  }

  entries() {
    return new WrapperIterable(this._underlyingSet.entries())
  }

  values() {
    return new WrapperIterable(this._underlyingSet.values())
  }

  has(v: T) {
    return this._underlyingSet.has(v)
  }
}
