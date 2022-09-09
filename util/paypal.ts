import fetch from 'cross-fetch'
import { PaypalSubscription } from '../interfaces'

const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAY_CLIENT_ID
const PAYPAL_SECRET = process.env.PAYPAL_SECRET
const PAYPAL_API = process.env.PAYPAL_API
const subscriptionURL = 'v1/billing/subscriptions'


export const getPaypalBearerToken = async ():Promise<string | null> => {
  const base64Token = Buffer.from(`${PAYPAL_CLIENT}:${PAYPAL_SECRET}`, 'utf-8').toString('base64')

  let urlencoded = new URLSearchParams()
  urlencoded.append('grant_type', 'client_credentials')

  try {
    const res = await fetch(process.env.PAYPAL_OAUTH_URL || '', {
      method: 'POST',
      body: urlencoded,
      headers: {
        'Authorization':`Basic ${base64Token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })

    const data = await res.json()
    return data.access_token
  } catch (error) {
    console.error(error)
    return null
  }
}

type confirmPaypalSubscription = (subscriptionID: string) => Promise<PaypalSubscription | null>

export const getPaypalSubscription:confirmPaypalSubscription = async (subscriptionID: string) => {
  try {
    const token = await getPaypalBearerToken()

    if( !token ) return null

    const url = `${PAYPAL_API}/${subscriptionURL}/${subscriptionID}`

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
    const data = await res.json()
    return data
  } catch(error) {
    console.log(error)
    return null
  }
}

export const cancelPaypalSubscription = async (paypalSubscriptionID: string) => {
  const url = `${PAYPAL_API}/${subscriptionURL}/${paypalSubscriptionID}/cancel`

  const token = await getPaypalBearerToken()
  if( !token ) return null
  
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        reason: 'User doesn\'t want to continue with subscription'
      })
    })

    if( !res.ok ) return null
    return {ok: true}

  } catch (error) {
    console.log(error)
    return null
  }
}
