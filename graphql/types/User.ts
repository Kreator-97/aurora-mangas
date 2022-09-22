import { 
  enumType,
  extendType,
  inputObjectType,
  nonNull,
  objectType,
  stringArg
} from 'nexus'
import prisma from '../../lib/prisma'

import { dbUsers } from '../../database'
import { userResolver } from '../resolvers'
import { Response, ResponseType } from './interface'
import { cancelPaypalSubscription, getPaypalSubscription } from '../../util/paypal'

export const User = objectType({
  name: 'User',
  definition(t) {
    t.id('id')
    t.string('fullname')
    t.string('email')
    t.string('password')
    t.string('imgURL')
    t.field('role', { type: Role })
    t.string('createdAt')
    t.string('updatedAt')
    t.field('address', {
      type: 'Address',
      async resolve(root, args, ctx) {
        return await prisma.user.findUnique({
          where: { id: root.id || '' }
        }).address()
      }
    })
  }
})

export const Address = objectType({
  name: 'Address',
  definition(t) {
    t.string('city')
    t.string('col')
    t.string('cp')
    t.string('number')
    t.string('state')
  }
})

const Role = enumType({
  name: 'Role',
  members: ['ADMIN', 'USER']
})

export const UsersQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('allUsers', {
      type: UsersResponse,
      resolve: userResolver
    })
  },
})

export const CreateUser = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createUser', {
      type: UserResponse,
      args: {
        user: nonNull(UserInput),
      },
      async resolve(root, args, ctx) {
        const { fullname, email, password } = args.user

        try {
          await dbUsers.isEmailAvailible(email)
          const user = await dbUsers.registerUser({email, password, fullname})

          return {
            user,
            ok: true,
            message: 'User created successfully',
            error: null,
          } as any
        } catch(error: any) {
          console.error(error)
          return {
            user: null,
            ok: false,
            message: error,
            error: error as string,
          }
        }
      }
    })
  },
})

export const CreateAndUpdateDirection = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createAndUpdateDirection', {
      type: nonNull(ResponseType),
      args: {
        userId: nonNull(stringArg()),
        address: nonNull(addressInput),
      },
      async resolve(root, args, ctx) {
        const { session } = ctx

        if( !session ) {
          return {
            message: 'Token not sent',
            error: 'Authentication failed',
            ok: false,
          }
        }

        // este resolver se encarga tanto de crear como de actualizar una dirección
        const userId = args.userId
        const address = args.address

        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: { address: true }
        })
        if( session.user.id !== user?.id ) {
          return {
            message: 'This user cannot perform this operation',
            error: 'Authorization failed',
            ok: false
          }
        }
        
        // si la dirección existe entonces realizamos una actualización
        if( user?.address ) {
          try {
            await prisma.address.update({
              where: {
                userId,
              },
              data: {
                city: address.city,
                col: address.col,
                cp: address.cp,
                number: address.number,
                state: address.state
              }
            })
        
            return {
              ok: true,
              message: 'La dirección ha sido actualizada',
              error: null,
            } as any
          } catch (error) {
            console.error(error)
            return {
              ok: false,
              message: 'No se pudo actualizar la dirección',
              error: null,
            }
          }
        }

        // Aqui realizamos una creación de la dirección del usuario
        try {
          await prisma.address.create({
            data: {
              city: address.city,
              col: address.col,
              cp: address.cp,
              number: address.number,
              state: address.state,
              userId: userId
            }
          })
        
          return {
            ok: true,
            message: 'La dirección ha sido guardada exitosamente',
            error: null
          }
        } catch (error) {
          console.error(error)
          return {
            ok: false,
            message:'Ocurrió un error al intentar guardar la dirección',
            error: null,
          }
        }
      }
    })
  },
})

const UsersResponse = objectType({
  name: 'UsersResponse',
  definition(t) {
    t.implements(Response)
    t.list.field('users', {
      type: 'User',
    })
  },
})

const UserResponse = objectType({
  name: 'UserResponse',
  definition(t) {
    t.implements(Response)
    t.field('user', {
      type: 'User',
    })
  },
})

const UserInput = inputObjectType({
  name: 'UserInput',
  definition(t) {
    t.nonNull.string('email')
    t.nonNull.string('fullname')
    t.nonNull.string('password')
  },
})

const addressInput = inputObjectType({
  name: 'AddressInput',
  definition(t) {
    t.nonNull.string('city')
    t.nonNull.string('col')
    t.nonNull.string('cp')
    t.nonNull.string('number')
    t.nonNull.string('state')
  },
})

export const CreateSubscription = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createSubscription', {
      type: 'ResponseType',
      args: {
        paypalSubscriptionID: nonNull(stringArg()),
        serieId: nonNull(stringArg()),
      },
      async resolve(root, args, ctx) {
        const { paypalSubscriptionID, serieId } = args

        const { session } = ctx
        if( !session ) {
          return {
            message: 'Este usuario no puede confirmar la suscripción',
            error: null,
            ok: false
          }
        }

        const subscription = await getPaypalSubscription(paypalSubscriptionID)

        if( !subscription || subscription.status !== 'ACTIVE' ) {
          return {
            message: 'La orden no pudo ser confirmada',
            error: null,
            ok: false
          }
        }

        try {
          await prisma.subscription.create({
            data: {
              userId: session.user.id,
              paypalSuscriptionId: subscription.id,
              serieId,
              status: subscription.status,
            }
          })

          return {
            message: 'Se ha creado la suscripción',
            ok: true,
            error: null
          }
        
        } catch (error: any) {
          console.error(error)
          return {
            message: 'Ocurrió un error al intentar realizar la suscripción',
            ok: false,
            error,
          }
        }
      }
    })
  },
})

export const CancelSubscription = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('cancelSubscription', {
      type: 'ResponseType',
      args: {
        subscriptionID: nonNull( stringArg() ),
      },
      async resolve(root, args, ctx) {
        const { session } = ctx
        if( !session ) {
          return {
            message: 'El usuario no está autenticado',
            ok: false,
            error: null,
          }
        }

        const { subscriptionID } = args

        const subscription = await prisma.subscription.findUnique({
          where: { id: subscriptionID }
        })

        if( !subscription ) {
          return {
            message: 'No existe una suscripción con el id proporcionado',
            ok: false,
            error: null,
          }
        }

        if( subscription.status === 'CANCELLED' ) {
          return {
            message: 'La suscripción ha sido cancelada previamente',
            ok: false,
            error: null,
          }
        }

        if( subscription.userId !== session.user.id ) {
          return {
            message: 'Este usuario no puede cancelar la suscripción',
            ok: false,
            error: null,
          }
        }

        try {
          const res = await cancelPaypalSubscription(subscription.paypalSuscriptionId)
          if( !res ) {
            return {
              message: 'Error en la petición hacia paypal',
              ok: false,
              error: null,
            }
          }

          await prisma.subscription.update({
            where: { id: subscriptionID },
            data: {
              status: 'CANCELLED',
            }
          })

          return {
            message: 'La suscripción ha sido cancelada',
            ok: true,
            error: null,
          } as any
        } catch (error) {
          console.error(error)
          return {
            message: 'Ocurrió un error al intentar cancelar la subscripción',
            ok: false,
            error,
          }
        }

      }
    })
  },
})
