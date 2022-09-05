import fetch from 'cross-fetch'

const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAY_CLIENT_ID
const PAYPAL_SECRET = process.env.PAYPAL_SECRET

export const getPaypalBearerToken = async ():Promise<string | null> => {
  const base64Token = Buffer.from(`${PAYPAL_CLIENT}:${PAYPAL_SECRET}`, 'utf-8').toString('base64')

  let urlencoded = new URLSearchParams()
  urlencoded.append('grant_type', 'client_credentials')

  try {
    const data = await fetch(process.env.PAYPAL_OAUTH_URL || '', {
      method: 'POST',
      body: urlencoded,
      headers: {
        'Authorization':`Basic ${base64Token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })

    const res = await data.json()
    return res.access_token
  } catch (error) {
    console.error(error)
    return null
  }
}
