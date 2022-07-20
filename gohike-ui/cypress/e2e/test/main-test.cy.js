/// <reference types="cypress" />

describe('Login', function() {
  it('Sign in', function() {
    cy.visit('http://localhost:3000/')
    cy.get('.login-button').contains('Log In').click()
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/login')
    })
  })
})