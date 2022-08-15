export interface Author {
  name      : string;
  birthDate : string;
}

export interface Manga {
  title : string;
  serie : string;
  number: string;
  price : number;
  author: Author;
}

type Genre = 'adventure' | 'fantasy' | 'romance' | 'horror' | 'thriller' | 'mystery' | 'martial arts' | 'gore' | 'action' | 'sobrenatural'

type Demography = 'shonnen' | 'seinen' | 'shojo' | 'josei' | 'isekai'

export interface Serie {
  name      : string;
  volumes   : Manga[];
  imgURL    : string;
  genre     : Genre[];
  demography: Demography[];
  finished  : boolean;
  periodicy : 'mensual' | 'bimestral';
  sipnosis? : string;
  unitPrice : number;
  author    : Author;
}
