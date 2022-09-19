
describe('tests integration on admin pages', () => {
  before(() => {
    cy.visit('http://localhost:3000')
  })

  it('user should can login as admin and visit all admin routes', () => {
    cy.login('admin@admin.com', '123456')
    cy.get('[data-testid="menu"]').as('menu').click()

    // check orders
    cy.contains('Ver pedidos realizados').click()
    
    // check subscriptions
    cy.get('@menu').click()
    cy.contains('Ver suscripciones').click()
    cy.contains('Suscripciones')
    
    // check series
    cy.get('@menu').click()
    cy.contains('button','Series').click()
    cy.contains('Series')
    
    // check mangas
    cy.get('@menu').click()
    cy.contains('button','Mangas').click()
    cy.contains('Mangas')
    
    // check autores
    cy.get('@menu').click()
    cy.contains('button','Autores').click()
    cy.contains('Autores')
    
    // check vendidos
    cy.get('@menu').click()
    cy.contains('button','Más vendidos').click()
    cy.contains('Productos más vendidos')
  })
})

export {}
