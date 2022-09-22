
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
          allUsers {
            message
            ok
            error
            users {
              id
              fullname
              email
              password
              imgURL
              role
              createdAt
              updatedAt
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
        const users = res.body.data.allUsers.users
        expect(users).length(2)
      })
  })
})

export {}
