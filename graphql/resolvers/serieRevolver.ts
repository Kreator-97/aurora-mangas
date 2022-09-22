import { FieldResolver } from 'nexus'

export const serieResolver:FieldResolver<'Query', 'series'> = async (parent, args, ctx) => {
  const series = await ctx.prisma.serie.findMany() as any
  return series
}
