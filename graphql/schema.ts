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
    unitPrice : Int!
    volumes   : [Manga]
  }

  type Manga {
    id        : ID
    author    : Author!
    imgURL    : String!
    number    : String!
    price     : Int!
    published : String!
    serie     : Serie!
    title     : String!
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
    series: [Serie!]!
    authors: [Author!]!
  }

  type Mutation {
    createAuthor(name:String): Author
    createSerie( serie:SerieInput ): Serie
  }
`
