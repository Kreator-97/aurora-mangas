import fetch from 'cross-fetch'

const defaultGraphqlEndpoint = 'http://localhost:3000/api/graphql'

interface Options {
  endpoint?: string;
  variables?: {
    [key: string]: any;
  };
  cookies?: {
    name: string;
    value: string;
  }[]
}

interface Response<T> {
  data: T;
}

type testEndpoint = <T = any>(query: string, options?: Options) => Promise<Response<T>>

export const testEndpoint:testEndpoint = async (query: string, options?: Options ) => {

  const headers = new Headers()

  headers.append('Content-Type', 'application/json')

  if( options?.cookies ) {
    let cookie = ''
    options.cookies.forEach((ck) => {
      cookie = `${ck.name}=${ck.value}; `
    })
    headers.append('Cookie', cookie)
  }

  try {
    const res = await fetch( options?.endpoint || defaultGraphqlEndpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        variables: options?.variables || {},
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
