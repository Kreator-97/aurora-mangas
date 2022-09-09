import { useMutation } from '@apollo/client'
import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import Image from 'next/image'
import { Toaster, toast } from 'react-hot-toast'
import { HiOutlineUserCircle } from 'react-icons/hi'

import { AppLayout } from '../../layouts'
import { CREATE_OR_UPDATE_DIRECTION } from '../../graphql/client'
import { dbUsers } from '../../database'
import { FormAddress } from '../../components'
import { Response, User } from '../../interfaces'

interface Props {
  user: User;
}

const UserPage: NextPage<Props> = ({user}) => {
  const [ createAndUpdateDirection ] = useMutation(CREATE_OR_UPDATE_DIRECTION)

  const onSubmit = async (formValues:FormAddress) => {

    try {
      const { data } = await createAndUpdateDirection({
        variables: {
          userId: user.id,
          address: formValues
        }
      })

      const { ok, message, error } = data.createAndUpdateDirection as Response

      if( !ok ) {
        console.error(error)
        throw new Error(message)
      }

      toast.success(message)
    } catch (error:any) {
      toast.error(error.message)
    }
  }
  
  return (
    <AppLayout title={`Usuario ${user.fullname}`} maxWidth='md'>
      <div className='pb-8 pt-4'>
        <h1 className='title'>{user.fullname}</h1>
        {
          user.imgURL
            ? (
              <div className='flex justify-center'>
                <Image
                  src={user.imgURL}
                  layout="fixed"
                  width={48}
                  height={48}
                  className='rounded-full'
                />
              </div>
            )
            : (
              <div className='flex justify-center'>
                <HiOutlineUserCircle
                  size={48}
                  color='var(--light)'
                  strokeWidth={1}
                />
              </div>
            )
        }
      </div>

      <div className='px-2'>
        <FormAddress address={user.address} onSubmit={ onSubmit } />
      </div>
      <Toaster />
    </AppLayout>
  )
}

export default UserPage

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)

  if( !session ) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  const user = await dbUsers.getUserById(session.user.id)

  return {
    props: {
      user
    }
  }
}
