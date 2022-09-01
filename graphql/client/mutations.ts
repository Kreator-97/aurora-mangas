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

export const CREATE_USER = gql`
  mutation CreateUser($email: String!, $fullname: String!, $password: String!) {
    createUser(email: $email, fullname: $fullname, password: $password) {
      ok
      error
      message
    }
  }
`

export const UPDATE_MANGA = gql`
  mutation UpdateManga($mangaId: String, $manga: MangaInput) {
    updateManga(mangaId: $mangaId, manga: $manga) {
      ok
      error
      message
    }
  }
`
