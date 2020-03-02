import jwtDecode from 'jwt-decode';

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

        cy.get('[data-cy=login-email]')
            .focus()
            .type('Info@physna.com');
        cy.get('[data-cy=login-password]')
            .focus()
            .type('badPassword');
        cy.get('[data-cy=login-form]').submit();
        cy.wait(30000);
        cy.get('[data-cy=login-error]');
    });

    it('succeeds when logging in with proper credentials', function() {
        cy.server({
            method: 'POST',
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

        cy.visit('/login');
        cy.get('[data-cy=login-email]')
            .focus()
            .type('Info@physna.com');
        cy.get('[data-cy=login-password]')
            .focus()
            .type('goodPassword');
        cy.get('[data-cy=login-form]').submit();
        cy.wait(30000);
        cy.location().should(loc => {
            expect(loc.pathname).to.eq('/');
        });
    });
});
