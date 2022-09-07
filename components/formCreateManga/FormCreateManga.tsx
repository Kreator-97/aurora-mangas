import { FC, FormEvent, useState } from 'react'
import { Toaster } from 'react-hot-toast'

import { useForm } from '../../hooks'
import { Manga, Serie } from '../../interfaces'
import { validations } from '../../util'

const formValidations = {
  serie: validations.noEmptyString,
  title: validations.noEmptyString,
  imgURL: validations.mustToBeCloudinaryImgURL,
  number: validations.isValidNumber,
  price: validations.isValidNumber,
  month: {
    validation: (value:string) => ( !isNaN(Number(value)) ) && value !== '',
    message: 'Este campo debe de ser un número válido entre 1 y 12',
  },
  year: {
    validation: (value:string) => ( !isNaN(Number(value)) ) && value !== '',
    message: 'Este campo debe de ser un año superior a 2020',
  },
  stock: validations.isValidNumber,
  incrementStock: validations.isValidNumber
}

interface Props {
  series : Serie[];
  onSubmit: (formValues:FormCreateManga) => Promise<void>;
  manga?: Manga;
  resetOnSubmit?: boolean;
}

export interface FormCreateManga {
  serie           : string;
  imgURL          : string;
  number          : string;
  price           : string;
  title           : string;
  month           : string;
  year            : string;
  stock           : number;
  incrementStock  : number;
}

export const FormCreateManga: FC<Props> = ({series, onSubmit, manga, resetOnSubmit = true}) => {
  const [showErrors, setShowErrors] = useState(false)
  const date = manga?.published ? manga.published.split('/') : []
  const mangaYear = date[0]
  const mangaMonth = date [1]

  const { imgURL, number, price, title, serie, month, year, stock, incrementStock, errors, onInputChange, onResetForm } = useForm<FormCreateManga>({
    serie   : manga?.serie.id || '',
    imgURL  : manga?.imgURL|| '',
    number  : manga?.number || '',
    price   : String(manga?.price) || '',
    title   : manga?.title || '',
    month   : mangaMonth || '',
    year    : mangaYear || '',
    stock   : manga?.stock || 0,
    incrementStock: 0,
  }, formValidations)

  const onSubmitEvent = async (e:FormEvent) => {
    e.preventDefault()

    // this validate form before send it to submit
    if( Object.values(errors).some( value => value !== null) ) {
      setShowErrors(true)
      return
    }

    const formValid:FormCreateManga = { serie, title, number, imgURL, price, year, month, stock, incrementStock }

    // we execute onSubmit event handle from parent element
    await onSubmit(formValid)

    setShowErrors(false)
    if( resetOnSubmit ) {
      onResetForm()
    }
  }

  return (
    <form className='mx-auto mb-4 max-w-lg' onSubmit={onSubmitEvent} data-testid="form-create-manga">
      <div className='flex flex-col gap-4 mb-4'>

        <div className='flex flex-col gap-2'>
          <label htmlFor="serie" className='text-lg'>
            Seleccionar serie
          </label>
          <select
            name="serie"
            id="serie"
            className='input bg-white'
            value={ serie }
            onChange={ onInputChange }
          >
            <option
              value=""
              defaultChecked
              disabled
            >
              Selecciona una serie
            </option>
            {
              series.map((serie) => {
                return (
                  <option key={serie.id} value={serie.id}>{serie.name}</option>
                )
              })
            }
          </select>
          { (errors.serie && showErrors) && (<p className='text-error'>{errors.serie}</p>) }
        </div>

        <div className='flex flex-col gap-2'>
          <label htmlFor="number" className='text-lg'>
              Escribe el número de volumen
          </label>
          <input
            min={0}
            type="number"
            name="number"
            id="number"
            className='input'
            placeholder='Número'
            value={ number }
            onChange={ onInputChange }
          />
          { (errors.number && showErrors) && (<p className='text-error'>{errors.number}</p>) }
        </div>
          
        <div className='flex flex-col gap-2'>
          <label htmlFor="price" className='text-lg'>
              Escribe el precio unitario
          </label>
          <input
            min={0}
            type="number"
            name="price"
            id="price"
            className='input'
            placeholder='Escribe el precio unitario'
            value={ price }
            onChange={ onInputChange }
          />
          { (errors.price && showErrors) && (<p className='text-error'>{errors.price}</p>) }
        </div>

        <div className='flex flex-col gap-2'>
          <label htmlFor="imgURL" className='text-lg'>
              Coloca la URL de la serie (cloudinary)
          </label>
          <input
            type="text"
            name="imgURL"
            id="imgURL"
            className='input'
            placeholder='Coloca una url de cloudinary'
            value={ imgURL }
            onChange={ onInputChange }
          />
          { (errors.imgURL && showErrors) && (<p className='text-error'>{errors.imgURL}</p>) }
        </div>

        <div className='flex flex-col gap-2'>
          <label htmlFor="title" className='text-lg'>
              Escribe un título
          </label>
          <input
            type="text"
            name="title"
            id="title"
            className='input'
            placeholder='Escribe un título'
            value={ title }
            onChange={ onInputChange }
          />
          { (errors.title && showErrors) && (<p className='text-error'>{errors.title}</p>) }
        </div> 

        <div className='grid grid-cols-2 gap-2'>
          <div className='flex flex-col'>
            <label htmlFor="month" className='text-lg'>
                Mes de publicación
            </label>
            <input
              min={1}
              max={12}
              type="number"
              name="month"
              id="month"
              className='input'
              value={ month }
              onChange={ onInputChange }
              placeholder='Introduce el mes de publicación'
            />
            { (errors.month && showErrors) && (<p className='text-error'>{errors.month}</p>) }
          </div>

          <div className='flex flex-col'>
            <label htmlFor="year" className='text-lg'>
                Año de publicación
            </label>
            <input
              min={2020}
              max={2030}
              type="number"
              name="year"
              id="year"
              className='input'
              value={ year }
              onChange={ onInputChange }
              placeholder='Introduce el año de publicación'
            />
            { (errors.year && showErrors) && (<p className='text-error'>{errors.year}</p>) }
          </div>
        </div>

        <div className='grid grid-cols-2 gap-2'>

          <div className='flex flex-col'>
            <label htmlFor="stock" className='text-lg'>
            Stock actual
            </label>
            <input
              min={0}
              type="number"
              name="stock"
              id="stock"
              className='input'
              value={ stock }
              readOnly
            />
            { (errors.stock && showErrors) && (<p className='text-error'>{errors.stock}</p>) }
          </div>

          <div className='flex flex-col'>
            <label htmlFor="incrementStock" className='text-lg'>
              Incrementar Stock
            </label>
            <input
              min={0}
              type="number"
              name="incrementStock"
              id="incrementStock"
              className='input'
              value={ incrementStock }
              onChange={ onInputChange }
              placeholder='Añade el incremento de stock '
            />
            { (errors.incrementStock && showErrors) && (<p className='text-error'>{errors.incrementStock}</p>) }
          </div>

        </div>
        
      </div> 
      <button className='btn bg-accent w-full'>Guardar</button>
      <Toaster position='top-center'/>
    </form>
  )
}
