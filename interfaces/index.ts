export interface Author {
  name      : string;
  birthDate : string;
}

export interface Manga {
  serie : string;
  number: string;
  price : number;
  author: string;
  imgURL: string;
  published: string
  title?: string;
}

// type Genre = 'ACTION' | 'ADVENTURE' | 'FANTASY' | 'GORE' | 'HORROR' |  'MARTIAL_ARTS' | 'MYSTERY' | 'ROMANCE' | 'SOBRENATURAL' | 'THRILLER'

export interface Serie {
  author    : Author;
  finished  : boolean;
  genre     : string;
  imgURL    : string;
  name      : string;
  periodicy : 'MENSUAL' | 'BIMESTRAL';
  sinopsis? : string;
  volumes   : Manga[];
}

export * from './user'
