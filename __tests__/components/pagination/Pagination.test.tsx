import { fireEvent, render, screen } from '@testing-library/react'
import { Pagination } from '../../../components/pagination'

describe('tests on pagination component', () => {
  test('should to show one button per page', () => {
    render(<Pagination totalPages={5}/>)
    const btns = screen.getAllByTestId('btn-page')
    expect(btns.length).toBe(5)
  })

  test('current page should to have active class', () => {
    const currentPage = 3
    const { container } = render(<Pagination totalPages={5} initialPage={currentPage}/>)

    const activeBtn = container.querySelector('.active')
    expect(activeBtn?.textContent).toBe(String(currentPage))
  })

  test('onPage function should to be called when click button page', () => {
    const onPageChange = jest.fn()
    const { container } = render(<Pagination totalPages={5} onPageChange={ onPageChange }/>)
    const btnActive = container.querySelector('.active')
    fireEvent.click( btnActive! )

    expect(onPageChange).toHaveBeenCalled()
  })

  test('should to change the current page', () => {
    const expectedPage = 9
    const { container } = render(<Pagination totalPages={9} initialPage={5} />)

    const btnPage9 = screen.getByText(String(expectedPage))
    fireEvent.click( btnPage9 )

    const pageActive = container.querySelector('.active')
    expect( pageActive?.textContent ).toBe(String(expectedPage))
  })

  test('should to show page 1 on first position when pages are too many', () => {
    render(<Pagination totalPages={20} initialPage={15} />)
    
    const btns = screen.getAllByTestId('btn-page')
    expect(btns[0].textContent).toBe('1')
  })
})

