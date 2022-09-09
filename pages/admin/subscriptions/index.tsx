import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'

import { AppLayout } from '../../../layouts'
import { dbSubscriptions, dbUsers } from '../../../database'
import { Subscription } from '../../../interfaces'
import { Table } from '../../../components'

interface Props {
  subscriptions: Subscription[];
}

const SubscriptionsPage:NextPage<Props> = ({subscriptions}) => {
  
  return (
    <AppLayout title="Listado de suscripciones">
      <h1 className='title mb-2'>Suscripciones</h1>
      <Table columns={['ID', 'Serie', 'Usuario', 'Estado', 'Fecha' ]}>
        {
          subscriptions.map((sub) => {
            return (
              <tr key={sub.id}>
                <td>{sub.id}</td>
                <td>{sub.serie.name}</td>
                <td>{sub.user.fullname}</td>
                <td>{sub.status}</td>
                <td>{new Date(sub.date).toDateString()}</td>
              </tr>
            )
          })
        }
      </Table>
    </AppLayout>
  )
}

export default SubscriptionsPage

export const getServerSideProps:GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)

  const returnHome = {
    redirect: {
      destination: '/',
      permanent: false
    }
  }

  if( !session ) {
    return returnHome
  }

  const isValid = await dbUsers.validateRole(session.user.id, ['ADMIN'])

  if( !isValid ) {
    return returnHome
  }

  const subscriptions = await dbSubscriptions.getAllSubscriptions()

  return {
    props: { subscriptions }
  }
}
