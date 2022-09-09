export interface User {
  fullname  : string;
  email     : string;
  imgURL   ?: string;
  id        : string;
  role      : 'USER' | 'ADMIN'
  createdAt : string;
  updatedAt : string;
  address  ?: Address;
}

export interface Address {
  id      : string;
  state   : string;
  col     : string;
  city    : string;
  number  : string;
  cp      : string;
}
