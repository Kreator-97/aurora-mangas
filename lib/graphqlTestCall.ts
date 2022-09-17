import fetch from 'cross-fetch'

const defaultGraphqlEndpoint = 'http://localhost:3000/api/graphql'

interface Options {
  endpoint?: string;
  variables?: {
    [key: string]: string
  }
}

interface Response<T> {
  data: T;
}


type testEndpoint = <T = any>(query: string, options?: Options) => Promise<Response<T>>

export const testEndpoint:testEndpoint = async (query: string, options?: Options ) => {
  try {
    const res = await fetch( options?.endpoint || defaultGraphqlEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: options?.variables,
      }),
      redirect: 'follow'
    })
  
    const data = await res.json()
    return data
  } catch(err) {
    console.log(err)
    return null
  }
}
