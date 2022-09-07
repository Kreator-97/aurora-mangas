import { Serie } from './serie'

export interface Manga {
  id        : string;
  serie     : Serie;
  number    : string;
  price     : number;
  imgURL    : string;
  published : string;
  title     : string;
  stock     : number;
}
