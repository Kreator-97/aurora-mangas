import { gql } from 'apollo-server-micro'

export const typeDefs = gql`
  enum Periodicy {
    MENSUAL
    BIMESTRAL
  }

  enum Role {
    ADMIN
    USER
  }

  type User {
    id        : ID
    fullname  : String!
    email     : String!
    password  : String
    imgURL    : String
    role      : Role
    createdAt : String
    updatedAt : String
  }

  type Author {
    id        : ID
    name      : String!
    series    : [Serie]
  }

  type Serie {
    id          : ID
    author      : Author
    finished    : Boolean!
    genre       : String!
    imgURL      : String!
    name        : String!
    periodicy   : Periodicy
    isNewRelease: Boolean
    sinopsis    : String
    volumes     : [Manga]
    slug        : String!
  }

  type Manga {
    id        : ID
    serie     : Serie
    number    : String!
    price     : Int!
    imgURL    : String!
    published : String!
    title     : String
  }

  input SerieInput {
    author    : String!
    finished  : Boolean!
    genre     : String!
    imgURL    : String!
    name      : String!
    periodicy : Periodicy
    sinopsis  : String
    slug      : String!
  }

  input MangaInput {
    serieId  :String!,
    number   : String!,
    price    : Int!,
    imgURL   : String!,
    published: String!,
    title    : String
  }

  type Response {
    ok: Boolean!
    error: String
    message: String!
  }

  type UserResponse {
    user: User
    ok: Boolean!
    error: String
    message: String!
  }
  
  type MangaResponse {
    manga: Manga
    ok: Boolean!
    error: String
    message: String!
  }

  type Item {
    product: Manga
    amount: Int
  }

  input ItemsInput {
    productId: String!
    amount: Int!
  }

  type Order {
    id: String
    total: Int!
    items: [Item!]
    user: User!
  }

  type Query {
    series: [Serie!]
    authors: [Author!]
    volumes(serieId: String): [Manga!]
    users: [User!]
    orders: [Order!]
  }

  type Mutation {
    createAuthor(name:String): Author

    createSerie( serie:SerieInput ): Serie

    createManga(
      serieId:String!,
      number: String!,
      price: Int!,
      imgURL: String!,
      published: String!,
      title: String
    ):Response!

    createUser(
      email: String!,
      fullname: String!,
      password: String!,
    ): UserResponse

    updateManga(
      mangaId: String,
      manga:MangaInput
    ): MangaResponse!

    createOrder(
      items: [ItemsInput!], total: Int!
    ): String!
  }
`
