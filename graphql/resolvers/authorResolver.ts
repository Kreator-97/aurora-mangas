import { FieldResolver } from 'nexus'

export const authorResolver: FieldResolver<'Query', 'authors'> = async (parent, args, ctx) => {
  const authors = await ctx.prisma.author.findMany()

  return authors
}
