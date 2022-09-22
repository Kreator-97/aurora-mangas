

describe('test integration on home page', () => {
  before(() => {
    cy.visit('http://localhost:3000')
  })

  it('should to get home', () => {
    cy.get('[data-testid="menu"]').click()
    cy.get('[data-testid="close-icon"]').click()
    
    cy.get('[data-testid="shopping-cart-menu"]').click()
    cy.get('[data-testid="close-shopping-cart-icon"]').click()
  })

  it('user should to add items on cart and create and order', () => {
    // login
    cy.login('user@user.com', '123456')
    
    // add items to cart
    cy.contains('Agregar al carrito').first().click()
    cy.get('[data-testid="card-manga"]:nth-child(2) > div > button').click()
    cy.get('[data-testid="card-manga"]:nth-child(3) > div > button').click()
    cy.get('[data-testid="shopping-cart-menu"]').click()
    cy.contains('Ir al resumen').click()

    // confirm order
    cy.contains('Confirmar pedido').click()
    cy.get('input[name="state"]').type('Chiapas')
    cy.get('input[name="city"]').type('Chiapas de corzo')
    cy.get('input[name="col"]').type('Grijalva')
    cy.get('input[name="number"]').type('203')
    cy.get('input[name="cp"]').type('30505')
    cy.contains('Guardar dirección').click()
    cy.get('[data-testid="app-logo"]').click()
    cy.wait(3000) // eslint-disable-line
    cy.get('[data-testid="menu"]').click()
    cy.contains('Cerrar sesión').click()
  })
  
  it('User should to create a new account correctly', () => {
    cy.wait(1000) // eslint-disable-line
    cy.get('[data-testid="menu"]').click()
    cy.contains('Crear cuenta').click()
    cy.get('input[name="name"]').type('Adrian flores')
    cy.get('input[name="email"]').type('adrian@user.com')
    cy.get('input[name="password"]').type('123456')
    cy.contains('button', 'Crear cuenta').click()
    cy.get('[data-testid="menu"]').click()
    cy.contains('Adrian flores')
    cy.contains('Cerrar sesión').click()
  })

  it('user should be able to search query and watch the result query', () => {
    const query = 'one punch man'
    cy.get('[data-testid="search-input"]').type(query)
    cy.get('[data-testid="search-icon"]').click()
    cy.contains( `Resultados para "${query}"` )
    cy.contains('button', 'Ver serie').click()

    cy.get('[data-testid="search-input"]').type(' #1')
    cy.get('[data-testid="search-icon"]').click()
  })

  after( async () => {
    cy.request({
      method: 'POST',
      url: '/api/db/reset/address'
    })
    cy.request({
      method: 'POST',
      url: '/api/db/reset/order'
    })
    cy.request({
      method: 'POST',
      url: '/api/db/reset/user'
    })
  })
})

export {}
