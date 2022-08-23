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

export const CREATE_MANGA = gql`
  mutation CreateManga($serieId: String!, $number: String!, $price: Int!, $imgURL: String!, $published: String!, $title: String) {
    createManga(serieId: $serieId, number: $number, price: $price, imgURL: $imgURL, published: $published, title: $title) {
      ok
      error
      message
    }
  }
` 
