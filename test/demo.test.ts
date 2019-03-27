import { blinq, hashString, range } from '../src/blinq'
import { deepEqualityComparer } from '../src/comparer/deepEqualityComparer'
import { EqualityComparer } from '../src/comparer/EqualityComparer'

interface Date {
  day: number
  month: number
  year: number
}
interface Activities {
  date: Date
  message: string
}
describe('demo', () => {
  const activities: Activities[] = [
    { date: { day: 1, month: 1, year: 1999 }, message: 'clean car' },
    { date: { day: 1, month: 2, year: 1999 }, message: 'tidy living room' },
    { date: { day: 2, month: 1, year: 1999 }, message: 'hoover stairs' },
    { date: { day: 1, month: 2, year: 1999 }, message: 'sweep yard' },
    { date: { day: 1, month: 1, year: 1998 }, message: 'mop kitchen' },
    { date: { day: 1, month: 2, year: 1998 }, message: 'polish furniture' },
    { date: { day: 2, month: 1, year: 1999 }, message: 'drink tea' },
    { date: { day: 1, month: 2, year: 1999 }, message: 'visit family' },
    { date: { day: 1, month: 1, year: 1999 }, message: 'eat out' },
    { date: { day: 1, month: 2, year: 2000 }, message: 'dinner party' },
    { date: { day: 2, month: 1, year: 2001 }, message: 'lunch date' },
    { date: { day: 1, month: 2, year: 1998 }, message: 'gig' }
  ]
  it('is sorting complex objects', () => {
    const messagesByDate = blinq(activities)
      .groupBy(x => x.date, deepEqualityComparer)
      .orderBy(g => g.key.year)
      .thenBy(g => g.key.month)
      .thenBy(g => g.key.day)
      .select(g => ({ date: g.key, messages: [...g.select(x => x.message)] }))
    expect(messagesByDate.select(m => m.messages.length).sum()).toBe(activities.length)
  })
  it('can make a case insensitive set', () => {
    const names = ['zebra', 'antelope', 'ardvaark', 'tortoise', 'turtle', 'dog', 'frog']
    const manyNames = blinq(names).selectMany(name => range(0, 1000).select(i => `${name}${i}`))

    const comparer: EqualityComparer<string> = {
      equals: (a, b) => a.toLowerCase() === b.toLowerCase(),
      getHashCode: x => hashString(x.toLowerCase())
    }
    const set = manyNames.toSet(comparer)
    expect(set.has('Dog66')).toBeTruthy()
    expect(set.has('Dog1000')).toBeFalsy()
  })
})
