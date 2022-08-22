import { gql } from '@apollo/client'

export const CREATE_SERIE = gql`
  mutation CreateSerie($serie: SerieInput) {
    createSerie(serie: $serie) {
      id
      name
    }
  }
`

export const CREATE_AUTHOR = gql`
  mutation CreateAuthor($name: String) {
    createAuthor(name: $name) {
      id
      name
    }
  }
`
