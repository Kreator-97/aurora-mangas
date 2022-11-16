import { Manga, User } from '.'

export interface Order {
  id          : string;
  items       : Item[]
  user        : User;
  total       : number;
  date        : string
  status      : 'PAID' | 'PENDING' | 'CANCELLED'
}

interface Item {
  amount    : number;
  product   : Manga;
  productId : string;
}
