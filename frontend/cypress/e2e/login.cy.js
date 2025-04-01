describe('Login Page', () => {
    it('logs in successfully with valid credentials', () => {
      cy.visit('http://localhost:3000/login'); // or your frontend URL
      cy.get('input[name="email"]').type('123@qq.com');
      cy.get('input[name="password"]').type('123');
      cy.get('button[type="submit"]').click();
  
      cy.url().should('include', '/tasks'); // Or whatever route comes after login
    });
  });
  