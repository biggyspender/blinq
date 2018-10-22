import WrapperIterable from './WrapperIterable'
import './extensions/aggregate'

export default class MapIterable<TKey, TValue> extends WrapperIterable<[TKey, TValue]> {
  private _underlyingMap: Map<TKey, TValue>
  constructor(map: Map<TKey, TValue>) {
    /* istanbul ignore next */
    {
      super(map)
    }
    this._underlyingMap = map
  }

  keys() {
    return new WrapperIterable(this._underlyingMap.keys())
  }

  entries() {
    return new WrapperIterable(this._underlyingMap.entries())
  }

  values() {
    return new WrapperIterable(this._underlyingMap.values())
  }

  has(v: TKey) {
    return this._underlyingMap.has(v)
  }

  get(key: TKey) {
    return this._underlyingMap.get(key)
  }

  convertToObject(this: MapIterable<string, TValue>) {
    return this.entries().aggregate({}, (acc: any, [key, value]) => {
      acc[key] = value
      return acc
    })
  }
}
