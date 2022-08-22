import { FormEvent, useState } from 'react'
import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'

import { AppLayout } from '../../../layouts'
import { dbAuthors, dbUsers } from '../../../database'
import { useForm } from '../../../hooks'
import { Author } from '../../../interfaces'

const CLOUDINARY_DOMAIN = 'https://res.cloudinary.com'

const formValidations = {
  name: {
    validation: (value:string) => value.trim() !== '',
    message: 'Este campo no puede estar vacio',
  },
  author: {
    validation: (value:string) => value.trim() !== '',
    message: 'Este campo no puede estar vacio',
  },
  periodicy: {
    validation: (value:string) => value.trim() !== '',
    message: 'Este campo no puede estar vacio',
  },
  finished: {
    validation: (value:string) => value.trim() !== '',
    message: 'Este campo no puede estar vacio',
  },
  imgURL: {
    validation: (value:string) => value.trim() !== '' && value.startsWith(CLOUDINARY_DOMAIN) ,
    message: 'Este campo debe de ser una URL de Cloudinary válida',
  },
}

interface Props {
  authors: Author[];
}

const AdminCreateSerie:NextPage<Props> = ({authors}) => {
  const [showErrors, setShowErrors] = useState(false)
  const { imgURL, name, sinopsis, genre, finished, author, periodicy, errors ,onInputChange, formState} = useForm({
    name: '',
    author: '',
    imgURL: '',
    sinopsis: '',
    genre: '',
    periodicy: '',
    finished: '',
  }, formValidations)

  const [ genres, setGenres ] = useState<string[]>([])

  const onSave = (e:FormEvent) => {
    e.preventDefault()
    const genre = genres.map( g => g.toUpperCase()).join(', ')

    if( !genre ) {
      setShowErrors(true)
      return
    }
    if( Object.values(errors).some( value => value !== null) ) {
      setShowErrors(true)
      return
    }
    console.log({...formState, genre: genres})
    console.log('Hay que realizar la inserción')
    console.log('formulario valido')
  }

  const addGenre = () => {
    if( !genres.includes(genre) ) {
      setGenres([...genres, genre])
    }
  }

  const removeGenre = (genre:string) => {
    setGenres(prevGenre => prevGenre.filter( g => g !== genre))
  }

  return (
    <AppLayout title="Crear serie | Admin" maxWidth='md'>
      <h1 className='title'>Agregar nueva serie</h1>
      <form className='mx-auto mb-4 max-w-lg' onSubmit={onSave}>
        <div className='flex flex-col gap-4 mb-4'>

          <div className='flex flex-col gap-2'>
            <label htmlFor="name" className='text-lg'>
              Nombre de la serie
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className='input'
              placeholder='Elige el nombre de la serie'
              value={ name }
              onChange={ onInputChange }
            />
            { (errors.name && showErrors) && (<p className='text-error'>{errors.name}</p>) }
          </div>
          
          <div className='flex flex-col gap-2'>
            <label htmlFor="author" className='text-lg'>
              Seleccionar autor
            </label>
            <select
              name="author"
              id="author"
              className='input bg-white'
              value={ author }
              onChange={ onInputChange }
            >
              <option
                value=""
                defaultChecked
                disabled>Selecciona un autor
              </option>
              {
                authors.map((author) => {
                  return (
                    <option key={author.id} value={author.id}>{author.name}</option>
                  )
                })
              }
            </select>
            { (errors.author && showErrors) && (<p className='text-error'>{errors.author}</p>) }
          </div>

          <div className='flex flex-col gap-2'>
            <label htmlFor="finished" className='text-lg'>
              Estado de la serie
            </label>
            <select
              name="finished"
              id="finished"
              className='input bg-white'
              value={ finished }
              onChange={ onInputChange }
            >
              <option value="" defaultChecked disabled >Selecciona una opción</option>
              <option value="true">Finalizado</option>
              <option value="false">En progreso</option>
            </select>
            { (errors.finished && showErrors) && (<p className='text-error'>{errors.finished}</p>) }
          </div>

          <div className='flex flex-col gap-2'>
            <label htmlFor="genre" className='text-lg'>
              Añade los generos
            </label>
            <div
              className='grid gap-2'
              style={{ gridTemplateColumns: '1fr auto'}}
            >
              <select
                name="genre"
                id="genre"
                className='input bg-white'
                value={ genre }
                onChange={ onInputChange }
              >
                <option value="" defaultChecked disabled >Selecciona una opción</option>
                <option value="ACCION" >Acción</option>
                <option value="ROMANCE" >Romance</option>
                <option value="FANTASY" >Fantasia</option>
              </select>
              <button
                className='btn bg-accent'
                type='button'
                onClick={ () => addGenre() }
              >
                Agregar
              </button>
            </div>
            <div className='flex gap-2'>
              {
                genres.map((g) => {
                  return (
                    <button
                      key={g}
                      className='btn text-sm'
                      type='button'
                      onClick={() => removeGenre(g) }
                    >
                      { g } ❌
                    </button>
                  )
                })
              }
            </div>
            { (genres.length === 0 && showErrors) && (<p className='text-error'>Debes agregar un genero</p>)  }
          </div>

          <div className='flex flex-col gap-2'>
            <label htmlFor="periodicy" className='text-lg'>
              Periodicidad
            </label>
            <select
              name="periodicy"
              id="periodicy"
              className='input bg-white'
              value={ periodicy }
              onChange={ onInputChange }
            >
              <option value="" defaultChecked disabled >Selecciona una opción</option>
              <option value="MENSUAL" >Mensual</option>
              <option value="BIMESTRUAL" >Bimestral</option>
            </select>
            { (errors.periodicy && showErrors) && (<p className='text-error'>{errors.periodicy}</p>) }
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
            <label htmlFor="sinopsis" className='text-lg'>
              Escribe la sinopsis (opcional)
            </label>
            <input
              type="text"
              name="sinopsis"
              id="sinopsis"
              className='input'
              placeholder='Sinopsis opcional'
              value={ sinopsis }
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

  const authors = await dbAuthors.getAuthors()

  return {
    props: {
      authors,
    }
  }
}
