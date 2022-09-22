import { enumType, extendType, inputObjectType, nonNull, objectType } from 'nexus'

import prisma from '../../lib/prisma'
import { suggestSlug } from '../../util'
import { serieResolver } from '../resolvers'
import { Author } from './Author'
import { Manga } from './Manga'

export const Serie = objectType({
  name: 'Serie',
  definition(t) {
    t.nonNull.id('id')
    t.nonNull.boolean('finished')
    t.nonNull.string('genre')
    t.nonNull.string('imgURL')
    t.boolean('isNewRelease')
    t.field('periodicy', { type: Periodicy })
    t.nonNull.string('name')
    t.nonNull.string('sinopsis')
    t.nonNull.string('slug')
    t.nonNull.field('author', {
      type: Author,
      async resolve(root, args, ctx) {
        return await prisma.serie.findUnique({
          where: { id: root.id }
        }).author() as any
      }
    })
    t.nonNull.list.field('volumes', {
      type: Manga,
      async resolve(root, args, ctx) {
        return await prisma.serie.findUnique({
          where: {
            id: root.id
          }
        }).volumes()
      }
    })
  },
})

export const SeriesQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('series', {
      type: Serie,
      resolve: serieResolver,
    })
  },
})

export const SerieMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createSerie', {
      type: nonNull(SerieResponse),
      args: {
        serie: nonNull(SerieInput),
      },
      resolve: async (root, args, ctx) => {
        const { session } = ctx
        if( !session ) {
          return {
            message: 'Token not sent',
            error: 'Authentication failed',
            ok: false,
            serie: null
          }
        }

        if( session.user.role !== 'ADMIN' ) {
          return {
            message: 'This user cannot perform this operation',
            error: 'Authorization failed',
            ok: false,
            serie: null
          }
        }

        const { authorId, finished, genre, imgURL, name, periodicy, sinopsis } = args.serie

        // we generate a slug automatically
        const slug = suggestSlug(name)

        try {
          
          const serie = await ctx.prisma.serie.create({
            data: {
              finished, genre, imgURL, name, sinopsis, slug, authorId, periodicy
            },
            include: {
              author: true,
              volumes: true
            }
          })
          
          return {
            message: 'Serie created',
            ok: true,
            error: null,
            serie,
          } as any
        } catch (error: any) {
          console.log(error)
          return {
            message: 'An error ocurred when trying to create a serie',
            ok: false,
            error: error.message,
            serie: null,
          }
        }
      }
    })
  }
})

export const SerieInput = inputObjectType({
  name: 'SerieInput',
  definition(t) {
    t.nonNull.string('authorId')
    t.nonNull.boolean('finished')
    t.nonNull.string('genre')
    t.nonNull.string('imgURL')
    t.nonNull.string('name')
    t.nonNull.field('periodicy', { type: 'Periodicy' })
    t.nonNull.string('sinopsis')
  },
})

const SerieResponse = objectType({
  name: 'SerieResponse',
  definition(t) {
    t.implements('Response')
    t.field('serie', {
      type: Serie,
    })
  },
})

const Periodicy = enumType({
  name: 'Periodicy',
  members: ['MENSUAL', 'BIMESTRAL']
})
