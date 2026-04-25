describe('Homepage', () => {
  it('successfully loads', () => {
    // Visits the baseUrl defined in cypress.config.ts
    cy.visit('/')
    
    // We can add assertions here later depending on the app's content
    cy.get('body').should('exist')
  })
})
