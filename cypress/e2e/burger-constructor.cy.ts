describe('burger constructor test', () => {
  beforeEach(() => {
    cy.setupIntercepts();
    cy.setAuthTokens();
    cy.visit('http://localhost:4000/');
  });

  it('getting ingredients tes', () => {
    cy.wait('@getIngredients');
    cy.get('[data-cy=ingredient]').should('have.length', 3);
    cy.contains('Флюоресцентная булка R2-D3').should('be.visible');
    cy.contains('Говяжий метеорит (отбивная)').should('be.visible');
    cy.contains('Соус с шипами Антарианского плоскоходца')
      .scrollIntoView()
      .should('be.visible');
  });

  it('adding ingredients to burger constructor', () => {
    cy.addIngredient(0);
    cy.checkIngredientInConstructor('Флюоресцентная булка R2-D3');

    cy.addIngredient(1);
    cy.checkIngredientInConstructor('Говяжий метеорит (отбивная)');

    cy.addIngredient(2);
    cy.checkIngredientInConstructor('Соус с шипами Антарианского плоскоходца');

    cy.addIngredient(1);
    cy.get('[data-cy=burger-constructor]').find('li').should('have.length', 3);
  });

  it('popup test', () => {
    cy.openIngredientDetails(0);
    cy.contains('Детали ингредиента').should('be.visible');
    cy.closeModal();
    cy.contains('Детали ингредиента').should('not.exist');

    cy.openIngredientDetails(0);
    cy.get('[data-cy=modal-overlay]').click({ force: true });
    cy.contains('Детали ингредиента').should('not.exist');
  });

  it('create order test', () => {
    cy.addIngredient(0);
    cy.placeOrder();
    cy.contains('Ваш заказ начали готовить').should('be.visible');
    cy.contains('71788').should('be.visible');
    cy.closeModal();
    cy.contains('Ваш заказ начали готовить').should('not.exist');
    cy.contains('Выберите булки').should('be.visible');
    cy.contains('Выберите начинку').should('be.visible');
  });
});
