import { FieldResolver } from 'nexus'

export const itemResolver:FieldResolver<'Order', 'items'> = async (root, args, ctx) => {
  return await ctx.prisma.item.findMany({
    include: {
      product: true
    }
  })
}
