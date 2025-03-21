import { setCookie, deleteCookie } from '../../src/utils/cookie';

declare global {
  namespace Cypress {
    interface Chainable {
      setupIntercepts(): void;
      setAuthTokens(): void;
      clearAuthTokens(): void;
      addIngredient(index: number): void;
      checkIngredientInConstructor(name: string): void;
      openIngredientDetails(index: number): void;
      closeModal(): void;
      placeOrder(): void;
    }
  }
}

Cypress.Commands.add('setupIntercepts', () => {
  cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', {
    fixture: 'burger-ingredients.json'
  }).as('getIngredients');
  cy.intercept('GET', 'https://norma.nomoreparties.space/api/auth/user', {
    fixture: 'user-data.json'
  }).as('getUser');
  cy.intercept('POST', 'https://norma.nomoreparties.space/api/orders', {
    fixture: 'order-data.json'
  }).as('getOrder');
});

Cypress.Commands.add('setAuthTokens', () => {
  cy.window().then((win) => {
    setCookie('accessToken', 'access-token');
    win.localStorage.setItem('refreshToken', 'refresh-token');
  });
});

Cypress.Commands.add('clearAuthTokens', () => {
  cy.window().then((win) => {
    deleteCookie('accessToken');
    win.localStorage.removeItem('refreshToken');
  });
});

Cypress.Commands.add('addIngredient', (index: number) => {
  cy.get('[data-cy=ingredient]')
    .eq(index)
    .within(() => {
      cy.get('button').filter(':contains("Добавить")').click({ force: true });
    });
});

Cypress.Commands.add('checkIngredientInConstructor', (name: string) => {
  cy.get('[data-cy=burger-constructor]').contains(name).should('be.visible');
});

Cypress.Commands.add('openIngredientDetails', (index: number) => {
  cy.get('[data-cy=ingredient]').eq(index).click();
});

Cypress.Commands.add('closeModal', () => {
  cy.get('[data-cy=close-button]').click();
});

Cypress.Commands.add('placeOrder', () => {
  cy.get('button').filter(':contains("Оформить заказ")').click({ force: true });
});
