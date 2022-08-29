import { fireEvent, render, screen } from '@testing-library/react'
import { SelectAmount } from '../../../components/selectAmount/SelectAmount'

describe('tests on SelectAmount component', () => {
  test('should to match with snapshot', () => {
    const { container } = render(<SelectAmount initial={1} />)
    const title = screen.getByText('Seleccione la cantidad')
    const amount = screen.getByText('1')

    expect(container).toMatchSnapshot()
    expect(title).toBeInTheDocument
    expect(amount).toBeInTheDocument
  })

  test('should to call decrement and increment events', () => {
    const onDecrementMock = jest.fn()
    const onIncrementMock = jest.fn()
    render(
      <SelectAmount
        initial={1}
        onDecrement={onDecrementMock}
        onIncrement={ onIncrementMock}
      />
    )

    const incrementIcon = screen.getByTestId('increment-icon')
    const decrementIcon = screen.getByTestId('decrement-icon')

    fireEvent.click(incrementIcon)
    expect(onIncrementMock).toHaveBeenCalled()

    const amount = screen.getByTestId('amount-box')
    expect( amount.textContent ).toBe('2')

    fireEvent.click(decrementIcon)
    expect(onDecrementMock).toHaveBeenCalled()

    expect( amount.textContent ).toBe('1')
  })
})
