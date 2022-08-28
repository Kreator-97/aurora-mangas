import { formatPrice } from '../../util/formatPrice'

describe('tests on formatPrice()', () => {
  test('should to format correctly when passing an int', () => {
    const price = formatPrice(99)
    expect(price).toBe('$99.00')
  })
  
  test('should to set the large floats to 2 numbers', () => {
    const price1 = formatPrice(129.0293846)
    const price2 = formatPrice(129.0138446)
    const price3 = formatPrice(129.9999999)

    expect(price1).toBe('$129.03')
    expect(price2).toBe('$129.01')
    expect(price3).toBe('$130.00')
  })
})


