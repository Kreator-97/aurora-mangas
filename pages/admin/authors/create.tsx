import { FormEvent } from 'react'
import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import { Toaster, toast } from 'react-hot-toast'
import { useMutation } from '@apollo/client'

import { AppLayout } from '../../../layouts'
import { dbAuthors, dbUsers } from '../../../database'
import { useForm } from '../../../hooks'
import { CREATE_AUTHOR } from '../../../graphql/client/mutations'

const AdminCreateAuthor:NextPage = () => {
  const [ createAuthor ] = useMutation(CREATE_AUTHOR)
  const { author, onInputChange, onResetForm } = useForm({
    author: '',
  })

  const onSave = async (e:FormEvent) => {
    e.preventDefault()

    if( author.trim() === '' ) {
      toast.error('El campo autor es obligatorio')
      return
    }

    const result = await createAuthor({variables: {name: author}})
    onResetForm()
    toast.success(`Se ha creado el autor ${result.data.createAuthor.name}`)
  }

  return (
    <AppLayout title="Crear nuevo autor | Admin" maxWidth='md'>
      <h1 className='title'>Agregar nuevo autor</h1>
      <form
        className='mx-auto mb-4 max-w-lg'
        data-testid="form-create-serie"
        onSubmit={onSave}
      >
        <div className='flex flex-col gap-4 mb-4'>
          <div className='flex flex-col gap-2'>
            <label htmlFor="author" className='text-lg'>
              Nombre del autor
            </label>
            <input
              type="text"
              name="author"
              id="author"
              className='input'
              placeholder='Escribe el nombre del author'
              value={ author }
              onChange={ onInputChange }
            />
          </div>
        </div>

        <button type='submit' className='btn bg-accent w-full'>Guardar</button>
        <Toaster position='top-center'/>
      </form>
    </AppLayout>
  )
}

export default AdminCreateAuthor

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
