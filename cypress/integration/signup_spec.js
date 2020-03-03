describe('The Signup Page', () => {
    it('successfully loads', () => {
        cy.visit('/signup');
    });

    it('Detects an invalid email address', () => {
        cy.visit('/signup');

        cy.get('[data-cy=signup-registration]')
            .focus()
            .type('BADCODE1');
        cy.get('[data-cy=signup-first-name]')
            .focus()
            .type('Test');
        cy.get('[data-cy=signup-last-name]')
            .focus()
            .type('Person');
        cy.get('[data-cy=signup-username]')
            .focus()
            .type('TestUser01');
        cy.get('[data-cy=signup-email]')
            .focus()
            .type('Info');
        cy.get('[data-cy=signup-password]')
            .focus()
            .type('goodPassword');
        cy.get('[data-cy=signup-confirm-password]')
            .focus()
            .type('goodPassword');
        cy.wait(5000);
        cy.get('[data-cy=signup-error]');
    });

    it('Detects passwords not matching', () => {
        cy.visit('/signup');

        cy.get('[data-cy=signup-registration]')
            .focus()
            .type('BADCODE1');
        cy.get('[data-cy=signup-first-name]')
            .focus()
            .type('Test');
        cy.get('[data-cy=signup-last-name]')
            .focus()
            .type('Person');
        cy.get('[data-cy=signup-username]')
            .focus()
            .type('TestUser01');
        cy.get('[data-cy=signup-email]')
            .focus()
            .type('Info@Physna.com');
        cy.get('[data-cy=signup-password]')
            .focus()
            .type('goodPassword');
        cy.get('[data-cy=signup-confirm-password]')
            .focus()
            .type('badPassword');
        cy.get('[data-cy=signup-password').focus();
        cy.wait(5000);
        cy.get('[data-cy=signup-error]');
    });

    it('Fails to create an account with an invalid registration code', () => {
        cy.server({
            method: 'POST',
        });

        cy.route({
            url: '/api/users/',
            status: 400,
            response: {
                registration_code: ['Registration code is invalid'],
            },
        });

        cy.visit('/signup');

        cy.get('[data-cy=signup-registration]')
            .focus()
            .type('BADCODE1');
        cy.get('[data-cy=signup-first-name]')
            .focus()
            .type('Test');
        cy.get('[data-cy=signup-last-name]')
            .focus()
            .type('Person');
        cy.get('[data-cy=signup-username]')
            .focus()
            .type('TestUser01');
        cy.get('[data-cy=signup-email]')
            .focus()
            .type('Info@physna.com');
        cy.get('[data-cy=signup-password]')
            .focus()
            .type('goodPassword');
        cy.get('[data-cy=signup-confirm-password]')
            .focus()
            .type('goodPassword');
        cy.get('[data-cy=signup-form]').submit();
        cy.wait(5000);
        cy.get('[data-cy=signup-error]');
    });
});
