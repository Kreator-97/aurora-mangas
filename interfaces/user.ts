export interface User {
  fullname  : string;
  email     : string;
  imgURL    : string;
  id        : string;
  role      : 'USER' | 'ADMIN'
  createdAt : string;
  updatedAt : string;
}
