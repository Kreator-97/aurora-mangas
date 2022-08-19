import { gql } from 'apollo-server-micro'

export const typeDefs = gql`
  enum Periodicy {
    MENSUAL
    BIMESTRAL
  }

  type Author {
    id        : ID
    name      : String!
    series    : [Serie]
  }

  type Serie {
    id        : ID
    author    : Author
    finished  : Boolean!
    genre     : String!
    imgURL    : String!
    name      : String!
    periodicy : Periodicy
    sinopsis  : String
    volumes   : [Manga]
  }

  type Manga {
    id        : ID
    serie     : Serie!
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
    unitPrice : Int!
  }

  type Query {
    series: [Serie!]
    authors: [Author!]
    volumes(serieId: String): [Manga!]
  }

  type Response {
    ok: Boolean!
    error: String
    message: String!
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
  }
`
