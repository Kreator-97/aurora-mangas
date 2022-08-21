import { Manga, User } from '.'

export interface Order {
  products    : Manga[];
  buyer       : User;
  totalPrice  : number;
  date        : Date
}
