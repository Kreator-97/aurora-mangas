import { Manga } from './manga'

export interface ShoppingCart {
  items: ShoppingItem[];
  total: number;
}

export interface ShoppingItem {
  product: Manga
  amount : number;
}
