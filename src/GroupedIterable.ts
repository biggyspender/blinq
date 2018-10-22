import WrapperIterable from './WrapperIterable'

export default class GroupedIterable<TKey, TValue> extends WrapperIterable<TValue> {
  private _key: any
  get key(): TKey {
    return this._key
  }
  constructor(key: TKey, it: Iterable<TValue>) {
    /* istanbul ignore next */
    {
      super(it)
    }
    this._key = key
  }
}
