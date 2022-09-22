import { extendType, nonNull, objectType, stringArg } from 'nexus'

import { authorResolver } from '../resolvers'
import { Serie } from './Serie'

export const Author = objectType({
  name: 'Author',
  definition(t) {
    t.nonNull.id('id')
    t.nonNull.string('name')
    t.list.field('series', {
      type: Serie,
      async resolve(root, args, ctx) {
        return await ctx.prisma.serie.findMany({
          where: { authorId: root.id }
        }) as any
      }
    })
  }
})

export const QueryAuthor = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('authors', {
      type: 'Author',
      resolve: authorResolver
    })
  }
})

export const createAuthor = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createAuthor', {
      type: AuthorResponse,
      args: {
        name: nonNull(stringArg()),
      },
      description: 'Crea un nuevo autor. Se requiere autorización',
      resolve: async (root, args, ctx) => {
        const { session } = ctx

        if( !session ) {
          return {
            message: 'Token not sent',
            error: 'Authentication failed',
            ok: false,
            author: null
          }
        }

        if( session.user.role !== 'ADMIN' ) {
          return {
            message: 'This user cannot perform this operation',
            error: 'Authorization failed',
            ok: false,
            author: null
          }
        }

        const author = ctx.prisma.author.create({
          data: {
            name: args.name,
          }
        })

        return {
          message: 'New author was created',
          error: null,
          ok: true,
          author,
        } as any
      }
    })
  },
})

export const AuthorResponse = objectType({
  name: 'AuthorResponse',
  definition(t) {
    t.implements('Response')
    t.field('author', {
      type: 'Author',
    })
  },
})
