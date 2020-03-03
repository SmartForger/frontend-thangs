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

    it('Successfully creates an account and logs in', () => {
        cy.server({
            method: 'POST',
        });

        cy.route({
            url: '/api/users/',
            status: 201,
            response: {
                url: 'http://localhost:8000/api/users/3/',
                email: 'r@r.com',
                username: 'colin',
                first_name: 'c',
                last_name: 'c',
                invite_code: '41793nck',
                registration_code: 'wwel5big',
                profile: null,
            },
        });

        cy.route({
            url: '/api/login/',
            status: 200,
            response: {
                refresh:
                    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTU4MzI2MjU4NSwianRpIjoiMmRlYTI4MDAyYTJlNGExMThjYWNiOTA2NjgxZmMwYjMiLCJ1c2VyX2lkIjo0LCJ1c2VybmFtZSI6IlRoYW5nc1Rlc3RlciIsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSJ9.SloAiPBzaUMWlYFlGa8SXznmSIdgR54bTVHHfVJ_9p8',
                access:
                    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNTgzMTc3MDg1LCJqdGkiOiJkZDRmM2Q0MWM1MTY0MDczYmIxMWJlYjMzZjQwN2Y4MyIsInVzZXJfaWQiOjQsInVzZXJuYW1lIjoiVGhhbmdzVGVzdGVyIiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIn0.5BauthGTQyWvxyU9PXsmHT4CemXwcUjSy_qq8UZUlQw',
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
        cy.location().should(loc => {
            expect(loc.pathname).to.eq('/');
        });
    });
});
