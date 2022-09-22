import { FieldResolver } from 'nexus'

export const userResolver:FieldResolver<'Query', 'users' | 'allUsers'> = async (parent, args, ctx) => {
  const { session } = ctx
  if( !session ) {
    return {
      ok: false,
      error: 'Authentication failed',
      message: 'Token not sent',
      users: null,
    }
  }

  const users = await ctx.prisma.user.findMany()

  return {
    ok : true,
    error: null,
    message: 'Users found',
    users
  }
}
