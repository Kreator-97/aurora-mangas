import { User } from '@prisma/client'
import bcrypt from 'bcrypt'
import prisma from '../lib/prisma'

interface RegisterUserProps {
  email: string;
  password: string;
  fullname: string;
}

export const isEmailAvailible = async (email:string):Promise<boolean> => {
  const user = await prisma.user.findUnique({where: { email }})
  if( user ) {
    await Promise.reject('This email already has been registered. Use other one')
  }
  return true
}

export const registerUser = async ({fullname, password, email}:RegisterUserProps) => {

  const hash = bcrypt.hashSync(password, 10)

  try {
    const user = await prisma.user.create({
      data: {
        email, password: hash, fullname,
      }
    })
    return user
  } catch(err) {
    console.error(err)
    return Promise.reject((err as {message:string}).message)
  }
}

export const authenticateUserWithEmailPassword = async (email: string, password:string ):Promise<User | null> => {
  const user = await prisma.user.findUnique({where: { email }})
  if ( !user ) return null

  const isValidPassword = bcrypt.compareSync(password, user.password)
  if( !isValidPassword ) return null

  return user
}

// this function verify if OAuth user has an previous account, otherwise we create a new
export const oAuthToDBUser = async (oAuthEmail:string, oAuthName: string, oAuthImg: string) => {
  const user = await prisma.user.findUnique({where: { email: oAuthEmail }})

  if( user ) {
    return {
      fullname    : user.fullname,
      email       : user.email,
      role        : user.role,
      imgURL      : user.imgURL,
      createdAt   : user.createdAt,
      updatedAt   : user.updatedAt,
      id          : user.id,
    }
  }

  try {
    const newUser = await prisma.user.create({
      data: {
        email: oAuthEmail,
        fullname: oAuthName,
        password: '@',
        imgURL: oAuthImg,
        provider: 'GOOGLE',
      }
    })
    return {
      fullname    : newUser.fullname,
      email       : newUser.email,
      role        : newUser.role,
      imgURL      : newUser.imgURL,
      createdAt   : newUser.createdAt,
      updatedAt   : newUser.updatedAt,
      id          : newUser.id,
    }
  } catch (error) {
    console.log(error)
    return Promise.reject((error as {message:string}).message)
  }
}

export const validateRole = async ( userId: string,expectedRoles: string[] ):Promise<boolean> => {
  const user = await prisma.user.findUnique({where: { id: userId }})
  if( !user ) return false

  if( expectedRoles.includes(user.role) ) return true
  
  return false
}

export const getUserById = async (userId: string):Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { address: true }
  })
  return JSON.parse( JSON.stringify(user) )
}
