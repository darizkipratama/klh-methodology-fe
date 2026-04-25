/* eslint-disable @typescript-eslint/no-namespace */
// ***********************************************
// Custom Cypress Commands
// ***********************************************

// `export {}` makes this file an ES module, which:
//   1. Allows `namespace` inside `declare global {}` (satisfies @typescript-eslint/no-namespace)
//   2. Ensures the type augmentation below is visible to Commands.add() above
export {};

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Logs in a user via the login form.
       * @param email    - The user's email address
       * @param password - The user's password
       */
      login(email: string, password: string): Chainable<void>;
    }
  }
}

/**
 * Custom login command that navigates to the login page,
 * fills in the credentials, and submits the form.
 *
 * @param email    - The user's email address
 * @param password - The user's password
 */
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');

  // Fill in the email field (type="text" without id)
  cy.get('form input[type="text"]').clear().type(email);

  // Fill in the password field
  cy.get('form input[type="password"]').clear().type(password);

  // Submit the login form
  cy.get('form button[type="submit"]').click();
});
