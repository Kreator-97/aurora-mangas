import { FormEvent, useState } from 'react'
import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'

import { AppLayout } from '../../../layouts'
import { dbSeries, dbUsers } from '../../../database'
import { useForm } from '../../../hooks'
import { Serie } from '../../../interfaces'

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
}

interface Props {
  series: Serie[];
}

const AdminCreateSerie:NextPage<Props> = ({series}) => {
  const [showErrors, setShowErrors] = useState(false)
  const { imgURL, number, price, title, serie, formState, errors, onInputChange } = useForm({
    serie: '',
    imgURL: '',
    number : '',
    price : '',
    title : '',
  }, formValidations)


  const onSave = (e:FormEvent) => {
    e.preventDefault()
    if( Object.values(errors).some( value => value !== null) ) {
      setShowErrors(true)
      return
    }
    console.log('formulario válido')
    console.log('Hay que realizar la inserción')
    console.log({formState})
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
                disabled>Selecciona un autor
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
        </div>
        <button className='btn bg-accent w-full'>Guardar</button>
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
