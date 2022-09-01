import { render } from '@testing-library/react'
import { Footer } from '../../../components/footer/Footer'

describe('tests on footer component', () => {
  test('should to match with snapshot', () => {
    const { container } = render(<Footer />)
    expect(container).toMatchSnapshot()
  })
})
