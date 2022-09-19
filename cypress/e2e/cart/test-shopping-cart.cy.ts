
describe('tests integration on shopping cart', () => {
  before(() => {
    cy.visit('http://localhost:3000')
  })

  it('user should to add items, delete, increment and decrement amount on cart', () => {
    // add first item
    cy.contains('Agregar al carrito').first().click()
    
    // verify cart
    cy.get('[data-testid="shopping-cart-menu"]').as('cart-menu').click()
    cy.get('[data-testid="close-shopping-cart-icon"]').click()
    
    // add more items
    cy.get('[data-testid="card-manga"]:nth-child(2) div button').click()
    cy.get('[data-testid="card-manga"]:nth-child(3) div button').click()

    // delete first element
    cy.get('@cart-menu').click()
    cy.contains('Eliminar del carrito').first().click()

    // go to checkout
    cy.contains('Ir al resumen').click()
    cy.contains('Resumen de compra')

    // delete last element
    cy.get('button.text-error.text-lg:last').click()

    // increment amount
    cy.get('[data-testid="increment-icon"]').click()
    cy.get('[data-testid="increment-icon"]').click()

    // decrement
    cy.get('[data-testid="decrement-icon"]').click()
    cy.get('[data-testid="decrement-icon"]').click()
    cy.get('[data-testid="decrement-icon"]').click()

    // delete last element
    cy.get('button.text-error.text-lg').click()
  })

})

export {}
