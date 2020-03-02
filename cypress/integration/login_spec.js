describe('The Login Page', function() {
    it('successfully loads', function() {
        cy.visit('/login');
    });

    it('fails to login, with incorrect credentials', function() {
        cy.server({
            method: 'POST',
        });
        cy.route({
            url: '/api/login/',
            status: 401,
            response: {
                detail: 'No active account found with the given credentials',
            },
        });

        cy.get('[data-cy=login-email]').type('Info@physna.com');
        cy.get('[data-cy=login-password]').type('badPassword');
        cy.get('[data-cy=login-form]').submit();
        cy.wait(1000);
        cy.get('[data-cy=login-error');
    });

    it('succeeds when logging in with proper credentials', function() {
        cy.server({
            method: 'POST',
        });
        cy.route({
            url: '/api/login/',
            status: 200,
            response: {
                refresh: 'faketoken',
            },
        });
        cy.visit('/login');
        cy.wait(400);
        cy.get('[data-cy=login-email]').type('Info@physna.com');
        cy.get('[data-cy=login-password]').type('goodPassword');
        cy.get('[data-cy=login-form]').submit();
        cy.wait(1000);
        cy.location().should(loc => {
            expect(loc.pathname).to.eq('/');
        });
    });
});
