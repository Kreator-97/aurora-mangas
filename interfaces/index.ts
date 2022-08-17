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
  published: string;
  title?: string;
}

type Genre = 'adventure' | 'fantasy' | 'romance' | 'horror' | 'thriller' | 'mystery' | 'martial arts' | 'gore' | 'action' | 'sobrenatural'

type Demography = 'shonnen' | 'seinen' | 'shojo' | 'josei' | 'isekai'

export interface Serie {
  author    : Author;
  demography: Demography[];
  finished  : boolean;
  genre     : Genre[];
  imgURL    : string;
  name      : string;
  periodicy : 'mensual' | 'bimestral';
  sinopsis? : string;
  unitPrice : number;
  volumes   : Manga[];
}
