import { interfaceType, objectType } from 'nexus'

export const Response = interfaceType({
  name: 'Response',
  definition(t) {
    t.nonNull.string('message')
    t.nonNull.boolean('ok')
    t.string('error')
  },
  resolveType() {
    return null
  }
})

export const ResponseType = objectType({
  name: 'ResponseType',
  definition(t) {
    t.implements('Response')
  },
})
