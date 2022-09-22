import { inputObjectType, objectType } from 'nexus'

export const Item = objectType({
  name: 'Item',
  definition(t) {
    t.nonNull.int('amount'),
    t.field('product', {
      description: 'Un producto es un Manga que está siendo comprado por un cliente',
      type: 'Manga',
    })
  },
})

export const ItemsInputType = inputObjectType({
  name: 'ItemsInput',
  definition(t) {
    t.nonNull.int('amount')
    t.nonNull.string('productId')
  }
})
