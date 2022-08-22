import { gql } from '@apollo/client'

export const AllUsers = gql`
  query GetAllUsers {
    users {
      id
      fullname
      email
      password
      imgURL
      role
      createdAt
      updatedAt
    }
  }
`
