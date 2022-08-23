import { FormEvent, useState } from 'react'
import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import toast, { Toaster } from 'react-hot-toast'
import { useMutation } from '@apollo/client'

import { AppLayout } from '../../../layouts'
import { CREATE_MANGA } from '../../../graphql/client/mutations'
import { dbSeries, dbUsers } from '../../../database'
import { Serie } from '../../../interfaces'
import { useForm } from '../../../hooks'

const CLOUDINARY_DOMAIN = 'https://res.cloudinary.com'

const formValidations = {
  serie: {
    validation: (value:string) => value.trim() !== '',
    message: 'Este campo no puede estar vacio',
  },
  imgURL: {
    validation: (value:string) => value.trim() !== '' && value.startsWith(CLOUDINARY_DOMAIN) ,
    message: 'Este campo debe de ser una URL de Cloudinary válida',
  },
  number: {
    validation: (value:string) => ( !isNaN(Number(value)) ) && value !== '',
    message: 'Este campo debe de ser un número válido',
  },
  price: {
    validation: (value:string) => ( !isNaN(Number(value)) ) && value !== '',
    message: 'Este campo debe de ser un número válido',
  },
  month: {
    validation: (value:string) => ( !isNaN(Number(value)) ) && value !== '',
    message: 'Este campo debe de ser un número válido entre 1 y 12',
  },
  year: {
    validation: (value:string) => ( !isNaN(Number(value)) ) && value !== '',
    message: 'Este campo debe de ser un año superior a 2020',
  },
}

interface Props {
  series: Serie[];
}

const AdminCreateSerie:NextPage<Props> = ({series}) => {
  const [showErrors, setShowErrors] = useState(false)
  const [ createManga ] = useMutation(CREATE_MANGA)
  const { imgURL, number, price, title, serie, month, year, errors, onInputChange, onResetForm } = useForm({
    serie: '',
    imgURL: '',
    number : '',
    price : '',
    title : '',
    month : '',
    year : '',
  }, formValidations)

  const onSave = async (e:FormEvent) => {
    e.preventDefault()

    if( Object.values(errors).some( value => value !== null) ) {
      setShowErrors(true)
      return
    }

    const monthPrefixed = Number(month) < 10 ? `0${Number(month)}` : month
    const published = `${year}/${monthPrefixed}/01`

    try {
      const { data } = await createManga({variables: {
        serieId: serie, title, number, imgURL, price: Number(price), published
      }})
      toast.success(data.createManga.message)
      setShowErrors(false)
      onResetForm()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <AppLayout title="Crear manga" maxWidth='md'>
      <h1 className='title'>Agregar nuevo manga</h1>
      <form className='mx-auto mb-4 max-w-lg' onSubmit={onSave}>
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
                disabled>Selecciona una serie
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
              Escribe un titulo (opcional)
            </label>
            <input
              type="text"
              name="title"
              id="title"
              className='input'
              placeholder='Titulo opcional'
              value={ title }
              onChange={ onInputChange }
            />
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
        
        </div> 
        <button className='btn bg-accent w-full'>Guardar</button>
        <Toaster position='top-center'/>
      </form>
    </AppLayout>
  )
}

export default AdminCreateSerie

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)
  
  const isValid = dbUsers.validateRole(session?.user.id || '', ['ADMIN'])
  if( !isValid ) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  const series = await dbSeries.getSeries()

  return {
    props: {
      series,
    }
  }
}
