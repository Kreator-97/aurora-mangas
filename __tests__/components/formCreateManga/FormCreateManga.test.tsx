import { expect } from '@jest/globals'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { series } from '../../fixtures/db'
import { FormManga } from '../../../components'

const onSubmit = jest.fn()

describe('Tests on FormManga component', () => {
  const serie = series[0]

  test('should to match with snapshot', () => {
    const { container } = render(
      <FormManga
        onSubmit={ async(formValues) => {}} 
        series={ series }
      />
    )
    
    expect(container).toMatchSnapshot()
  })

  test('should to contain all inputs necessary', () => {
    render(
      <FormManga
        onSubmit={ async(formValues) => {}} 
        series={ series }
      />
    )
    screen.getByLabelText('Seleccionar serie')
    screen.getByLabelText('Escribe el número de volumen')
    screen.getByLabelText('Escribe el precio unitario')
    screen.getByLabelText('Coloca la URL de la serie (cloudinary)')
    screen.getByLabelText('Escribe un título')
    screen.getByLabelText('Mes de publicación')
    screen.getByLabelText('Año de publicación')
    screen.getByLabelText('Stock actual')
    screen.getByLabelText('Incrementar Stock')

  })

  test('should to call onSubmit callback', async () => {
    render(
      <FormManga
        onSubmit={ onSubmit }
        series={ series }
        resetOnSubmit={ false }
      />
    )

    const form = screen.getByTestId('form-create-manga')

    const selectSerie = screen.getByRole('combobox', {name: 'Seleccionar serie'})
    const numberInput = screen.getByRole('spinbutton', {name: 'Escribe el número de volumen'})
    const unitPriceInput = screen.getByRole('spinbutton', {name: 'Escribe el precio unitario'})
    const imgURLInput = screen.getByRole('textbox', {name: 'Coloca la URL de la serie (cloudinary)'})
    const title = screen.getByRole('textbox', {name: 'Escribe un título'})
    const monthInput = screen.getByRole('spinbutton', {name: 'Mes de publicación'})
    const yearInput = screen.getByRole('spinbutton', {name: 'Año de publicación'})
    const incrementStockLabel = screen.getByRole('spinbutton', {name: 'Incrementar Stock'})

    fireEvent.change(selectSerie, {target: { value: serie.id, name: 'serie' }})
    fireEvent.change(numberInput, {target: { value: '1', name: 'number' }})
    fireEvent.change(unitPriceInput, {target: { value: '99', name: 'price' }})
    fireEvent.change(imgURLInput, {target: { value: serie.imgURL, name: 'imgURL' }})
    fireEvent.change(title, {target: { value: 'volumen no.1', name: 'title' }})
    fireEvent.change(monthInput, {target: { value: '1', name: 'month' }})
    fireEvent.change(yearInput, {target: { value: '2022', name: 'year' }})
    fireEvent.change(incrementStockLabel, {target: { value: '100', name: 'incrementStock' }})
    
    fireEvent.submit(form, {preventDefault: () => {}})

    await waitFor(() => {

      expect(onSubmit).toHaveBeenCalledWith({
        imgURL: serie.imgURL,
        month: '1',
        number: '1',
        price: '99',
        serie: serie.id,
        title: 'volumen no.1',
        year: '2022',
        stock: 0,
        incrementStock: '100',
      })
    })
  })
})
