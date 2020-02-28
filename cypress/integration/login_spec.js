describe('The Login Page', function() {
    it('successfully loads', function() {
        cy.visit('/login');
    });

    it('fails to login, with incorrect credentials', function() {
        cy.server({
            method: 'POST',
            delay: 300,
            status: 200,
            response: {},
        });

        cy.get('[data-cy=login-email]').type('Info@physna.com');
        cy.get('[data-cy=login-password]').type('badPassword');
        cy.get('[data-cy=login-form]').submit();
        cy.wait(1000);
        cy.get('[data-cy=login-error');
    });

    it('succedds when logging in with proper credentials', function() {
        cy.server();
    });
});
