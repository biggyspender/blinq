import { range } from '../src/blinq'
describe('randomOrder', () => {
  test('1', () => {
    const randomOrder = range(0, 20).orderBy(x => Math.random())
    expect(randomOrder.orderBy(x => x).sequenceEqual(range(0, 20))).toBeTruthy()
  })
})
