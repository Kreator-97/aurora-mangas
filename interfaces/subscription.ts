import { Serie, User } from '.'

export interface Subscription {
  id      : string
  status  : SubscriptionStatus
  user    : User
  userId  : string
  serie   : Serie
  serieId : string
  date    : String
}

export type SubscriptionStatus = 'ACTIVE' | 'PAUSED' | 'CANCELLED'
