import { expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'

import { CardGrid } from '../../../components/cardGrid/CardGrid'
import { series } from '../../fixtures/db'

describe('tests on CardGrid component', () => {
  test('should to match with snapshot', () => {
    // we render an array with 2 series
    const component = render(<CardGrid series={[series[0], series[1]]} />)
    screen.getByTestId('card-grid')
    
    expect(component.container).toMatchSnapshot()
    expect(screen.getAllByTestId('card-serie').length ).toBe(2)
  })

})

