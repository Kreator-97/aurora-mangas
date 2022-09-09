import { Author, Manga, Subscription } from './'

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
  isNewRelease? : boolean;
  slug          : string;
  unitPrice     : number;
  totalVolumes  : number;
  paypalPlanId? : string;
  subscription  : Subscription[];
}
