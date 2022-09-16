import { User } from '@prisma/client'
import prisma from '../../lib/prisma'

import { authenticateUserWithEmailPassword, getUserById, validateRole } from '../../database/dbUsers'

describe('tests on dbUsers file', () => {

  let user: User | null = null
  beforeAll( async () => {
    user = await prisma.user.findUnique({
      where: { email: 'user@user.com' }
    })
  })

  test('authenticateUserWithEmailPassword should to return a user if authentication is correct', async () => {
    const userAuth = await authenticateUserWithEmailPassword(user!.email, '123456')

    expect(userAuth?.id).toBe(user?.id)
  })

  test('authenticateUserWithEmailPassword should to return null if authentication is not valid', async () => {
    const userAuth = await authenticateUserWithEmailPassword(user!.email, 'password-wrong')

    expect(userAuth).toBe(null)
  })

  test('validateRole should to return true if user role is valid', async () => {
    const isValid = await validateRole(user!.id, ['USER'])

    expect(isValid).toBe(true)
  })

  test('validateRole should to return false if user role is not valid', async () => {
    const isValid = await validateRole(user!.id, ['ADMIN'])

    expect(isValid).toBe(false)
  })

  test('getUserById should to return a user when id is valid', async () => {
    const userFound = await getUserById(user!.id)

    expect(userFound!.id).toBe(user!.id)
  })

  test('getUserById should to return null when userId is not valid', async () => {
    const userFound = await getUserById('1242452')

    expect(userFound).toBe(null)
  })
})

// TODO: test oAuthToDBUser function
