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

export const CREATE_ORDER = gql`
  mutation CreateOrder($total: Int!, $items: [ItemsInput!]) {
    createOrder(total: $total, items: $items) {
      error
      message
      ok
      orderId
    }
  }
`

export const CREATE_OR_UPDATE_DIRECTION = gql`
  mutation CreateAndUpdateDirection($userId: String, $address: AddressInput) {
    createAndUpdateDirection(userId: $userId, address: $address) {
      ok
      error
      message
    }
  }
`
