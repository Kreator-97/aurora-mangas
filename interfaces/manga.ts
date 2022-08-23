import { Author } from './author'
import { Serie } from './serie'

export interface Manga {
  id    : string;
  serie : Serie;
  number: string;
  price : number;
  author: Author;
  imgURL: string;
  published: string
  title?: string;
}
