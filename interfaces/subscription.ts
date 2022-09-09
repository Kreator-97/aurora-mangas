import { Serie, User } from '.'

export interface Subscription {
  id      : string
  status  : SubscriptionStatus
  user    : User
  serie   : Serie
  date    : string
}

export type SubscriptionStatus = 'ACTIVE' | 'PAUSED' | 'CANCELLED'
