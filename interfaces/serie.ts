import { Author } from './author'
import { Manga } from './manga'

export interface Serie {
  id            : string;
  author        : Author;
  finished      : boolean;
  genre         : string;
  imgURL        : string;
  name          : string;
  periodicy     : 'MENSUAL' | 'BIMESTRAL';
  sinopsis?     : string;
  volumes       : Manga[];
  isNewRelease? : boolean
}
