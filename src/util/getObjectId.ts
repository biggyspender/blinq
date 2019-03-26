export const getObjectId = (() => {
  let currentId = 0
  const map = new WeakMap<{}, number>()
  return (object: {}) => {
    if (!map.has(object)) {
      map.set(object, currentId)
      return currentId++
    }
    return map.get(object)!
  }
})()
