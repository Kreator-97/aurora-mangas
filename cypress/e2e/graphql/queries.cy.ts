
describe('test on private graphql query', () => {

  before(() => {
    cy.visit('http://localhost:3000')
    cy.login('admin@admin.com', '123456')
  })
  
  it('should to query all users', () => {
    cy.contains('Series nuevas')

    cy.request({
      url: '/api/graphql',
      method: 'POST',
      body: JSON.stringify({
        query: `
        {
          users {
            error
            message
            ok
            users {
              id
              createdAt
              email
              fullname
              imgURL
              password
              role
              updatedAt
              address {
                city
                col
                cp
                number
                state
              }
            }
          }
        }`,
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cy.getCookie('next-auth.session-token')}`
      },
    })
      .then((res) => {
        const users = res.body.data.users.users
        expect(users).length(2)
      })
  })
})

export {}
