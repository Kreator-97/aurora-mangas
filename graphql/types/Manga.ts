import { extendType, inputObjectType, nonNull, objectType, stringArg } from 'nexus'

import { mangasResolver } from '../resolvers'
import { Serie } from './Serie'

export const Manga = objectType({
  name: 'Manga',
  definition(t) {
    t.nonNull.id('id')
    t.nonNull.string('number')
    t.nonNull.int('price')
    t.nonNull.string('imgURL')
    t.nonNull.string('published')
    t.nonNull.string('title')
    t.nonNull.int('stock')
    t.field('serie', {
      type: Serie,
      async resolve(root, args, ctx) {
        return await ctx.prisma.manga.findUnique({
          where: {
            id: root.id
          }
        }).serie() as any
      }
    })
  },
})

export const mangaQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('mangas', {
      type: 'Manga',
      resolve: mangasResolver,
    })
  },
})

export const CreateManga = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('CreateManga', {
      type: MangaResponse,
      description: 'Crea un nuevo manga. Necesita autorización',
      args: {
        manga: nonNull(MangaInput)
      },
      resolve: async (root, args, ctx) => {
        if( !ctx.session ) {
          return {
            message: 'Token not send',
            error: 'Authentication failed',
            ok: false,
          }
        }
        
        const user = ctx.session.user
        
        if( user.role !== 'ADMIN' ) {
          return {
            message: 'This user cannot perform this operation',
            error: 'Authorization failed',
            ok: false,
          }
        }
  
        const { serieId, number, price, imgURL, published, title } = args.manga
  
        const isValidDate = new Date(published)
        if ( isValidDate.toString() === 'Invalid Date') {
          return {
            message: 'Manga was not created',
            error: 'Date is not valid',
            ok: false,
            manga: null
          }
        }
  
        const newManga = await ctx.prisma.manga.create({
          data: {
            imgURL,
            number,
            price,
            published,
            stock: 0,
            title,
            serieId,
          }, include: { serie: true }
        })
  
        return {
          ok: true,
          error: null,
          message: 'Manga agregado a la serie ' + newManga.serie.name,
          manga: newManga,
        } as any
      }
    })
  },
})

export const UpdateManga = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('updateManga', {
      type: 'MangaResponse',
      args: {
        mangaId: nonNull(stringArg()),
        manga: nonNull('MangaInput')
      },
      async resolve (root, args, ctx) {
        if( !ctx.session ) {
          return {
            message: 'Token not send',
            error: 'Authentication failed',
            ok: false,
          }
        }
        
        const user = ctx.session.user
        
        if( user.role !== 'ADMIN' ) {
          return {
            message: 'This user cannot perform this operation',
            error: 'Authorization failed',
            ok: false,
          }
        }
  
        const { mangaId } = args
        const { number, price, imgURL, published, title, stock } = args.manga

        const update: any = { number, price, imgURL, published, title }
        
        if (typeof stock === 'number') {
          update.stock = stock
        }

        try {
          const mangaUpdated = await ctx.prisma.manga.update({
            where: {
              id: mangaId,
            },
            data: update,
            include: {
              serie: true,
            }
          })

          return {
            manga: mangaUpdated,
            ok: true,
            message: 'Actualizado con éxito',
            error: null,
          } as any
        } catch (error) {
          console.log(error)
          return {
            manga: null,
            ok: false,
            message: 'Ocurrió un error al actualizar',
            error: (error as { message: string }),
          }
        }
      },
    })
  },
})

const MangaResponse = objectType({
  name: 'MangaResponse',
  definition(t) {
    t.implements('Response')
    t.field('manga', {
      type: 'Manga',
    })
  },
})

const MangaInput = inputObjectType({
  name: 'MangaInput',
  definition(t) {
    t.nonNull.string('serieId')
    t.nonNull.string('number')
    t.nonNull.int('price')
    t.nonNull.string('imgURL')
    t.nonNull.string('published')
    t.nonNull.string('title')
    t.int('stock')
  },
})
