
export interface Response {
  ok     : boolean;
  message: string;
  error ?:string
}

export interface OrderResponse extends Response{
  orderId: string;
}
