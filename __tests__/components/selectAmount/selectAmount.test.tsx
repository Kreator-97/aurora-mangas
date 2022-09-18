import { expect } from '@jest/globals'
import { fireEvent, render, screen } from '@testing-library/react'
import { SelectAmount } from '../../../components/selectAmount/SelectAmount'

describe('tests on SelectAmount component', () => {
  test('should to match with snapshot', () => {
    const { container } = render(<SelectAmount initial={1} />)
    const title = screen.getByText('Seleccione la cantidad')
    const amount = screen.getByText('1')

    expect(container).toMatchSnapshot()
    expect(title)
    expect(amount)
  })

  test('should to call onChangeAmount event', () => {
    const onChangeAmountMock = jest.fn()
    const id = '123-abc-xyz'
    render(
      <SelectAmount
        initial={1}
        onChangeAmount={ onChangeAmountMock }
        minValue={1}
        id={id}
      />
    )

    const incrementIcon = screen.getByTestId('increment-icon')
    const decrementIcon = screen.getByTestId('decrement-icon')

    fireEvent.click(incrementIcon)
    expect(onChangeAmountMock).toHaveBeenCalledWith(2, id)

    const amount = screen.getByTestId('amount-box')
    expect( amount.textContent ).toBe('2')

    fireEvent.click(decrementIcon)
    expect(onChangeAmountMock).toHaveBeenCalledWith(1, id)

    expect( amount.textContent ).toBe('1')
  })
})
