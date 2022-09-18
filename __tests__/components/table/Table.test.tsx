import { expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { Table } from '../../../components/table/Table'

describe('Tests on table components', () => {
  const columns = ['columna 1', 'columna 2', 'columna 3', 'columna 4', 'columna 5']

  test('should to show all columns correctly', () => {
    render(<Table columns={columns}/>)
    const cols = screen.getAllByTestId('column')
    expect(cols.length).toBe(columns.length)
  })

  test('should to render children prop', () => {
    render(<Table columns={columns}>
      <tr>
        <td data-testid="cell">Uno</td>
        <td data-testid="cell">Dos</td>
        <td data-testid="cell">Tres</td>
        <td data-testid="cell">Cuarto</td>
        <td data-testid="cell">Cinco</td>
      </tr>
    </Table>)

    const cells = screen.getAllByTestId('cell')
    expect(cells.length).toBe(5)
  })
})
