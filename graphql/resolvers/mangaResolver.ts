import { FieldResolver } from 'nexus'

export const mangasResolver: FieldResolver<'Query', 'mangas'> = async (parent, args, ctx) => {
  return await ctx.prisma.manga.findMany() as any
}

