/// <reference types="cypress" />

describe('Login', function() {
  it('Navigate to login', function() {
    // Navigate to login page
    cy.visit('http://localhost:3000/')
    cy.get('.login-button').contains('Log In').click()
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/login')
    })
  })

  it('Enter username and password', function() {
    // Enter user info
    cy.get('.username-input').type('admin123')
    cy.get('.password-input').type('admin123')

    // Login and check for login user info in local storage
    cy.get('.login-page-button').click().then((res) => {
      expect(cy.location().should((loc) => {
        expect(loc.pathname).to.eq('/')
      }))
    })
    cy.get('nav').contains("John Doe")
  })
})

describe('Logout', function() {
  it('Logout', function() {
    // Logout and check that currUser is null
    cy.get('span').contains('expand_more').click().then((res) => {
      cy.get('.dropdown').should('be.visible')
    })
    cy.get('.logout-item').click().then((res) => {
      cy.get('.login-button').should('be.visible')
    })
  })
})