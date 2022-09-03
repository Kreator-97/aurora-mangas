import { gql } from '@apollo/client'

export const AllUsers = gql`
  query GetAllUsers {
    users {
        id
        createdAt
        email
        fullname
        imgURL
        role
        updatedAt
        address {
          city
          col
          cp
          number
          state
        }
    }
  }
`
