/**
 * E2E Test: Authentication & Role-based Dashboard Redirect
 *
 * Scenario 1: Publisher role
 *   - Login with publisher credentials
 *   - Should be redirected to and see the Publisher (External) Dashboard
 *
 * Scenario 2: Internal role
 *   - Login with internal credentials
 *   - Should be redirected to and see the Admin (Internal) Dashboard
 */

describe('Authentication & Role-based Dashboard Redirect', () => {
  // ----------------------------------------------------------------
  // Scenario 1: Publisher role → External Dashboard
  // ----------------------------------------------------------------
  describe('Scenario 1: Publisher role', () => {
    it('should log in as publisher and see the publisher dashboard', () => {
      // Use the custom login command (defined in cypress/support/commands.ts)
      cy.login('publisher1@example.com', 'Password123!');

      // After successful login, publisher should land on /dashboard/external
      cy.url().should('include', '/dashboard/external');

      // Assert page content unique to the publisher dashboard
      // The heading "Daftar Metodologi yang Diajukan" appears in the breadcrumb
      cy.contains('Daftar Metodologi yang Diajukan').should('be.visible');

      // The "Usulkan Baru" (propose new) button is only present on the publisher dashboard
      cy.get('#usulkan-baru-btn').should('be.visible');

      // Assert the "Filter Metodologi" sidebar section exists
      cy.contains('Filter Metodologi').should('be.visible');
    });
  });

  // ----------------------------------------------------------------
  // Scenario 2: Internal role → Admin Dashboard
  // ----------------------------------------------------------------
  describe('Scenario 2: Internal role', () => {
    it('should log in as internal user and see the internal (admin) dashboard', () => {
      cy.login('internal1@example.com', 'Password123!');

      // After successful login, internal user should land on /dashboard/admin
      cy.url().should('include', '/dashboard/admin');

      // Assert content unique to the admin dashboard
      // Stats cards visible only on admin dashboard
      cy.contains('Kategori NEK').should('be.visible');
      cy.contains('Apresiasi Aktif').should('be.visible');

      // The master data table heading
      cy.contains('MASTER DATA PENGAJUAN DOKUMEN METODOLOGI').should('be.visible');
    });
  });
});
