import { FieldResolver } from 'nexus'

export const orderResolver:FieldResolver<'Query', 'items' | 'orders'>   = async (root, args, ctx) => {
  return await ctx.prisma.order.findMany()
}
