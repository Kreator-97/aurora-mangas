import { suggestSlug } from '../../util'

describe('tests on suggestSlug()', () => {
  const expectedResult = 'this-is-my-title'

  test('should to transform text correctly', () => {
    const res = suggestSlug('This is my title')
    expect(res).toBe(expectedResult)
  })

  test('should to return empty string on empty string', () => {
    const res = suggestSlug('')
    expect(res).toBe('')
  })

  test('should to replace all "_" by "-"', () => {
    const res = suggestSlug('This_is_my-title')
    expect(res).toBe(expectedResult)
  })

  test('should to remove duplicated values "-", "[space]" and "_"', () => {
    const res = suggestSlug('THIS  is --  my___title')
    expect(res).toBe(expectedResult)
  })
})
