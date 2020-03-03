describe('The Profile Page', () => {
    it('starts out in loading state', () => {
        cy.visit('/profile/1', {
            onBeforeLoad(win) {
                win['graphql-react'] = {
                    useUserById: () => ({
                        loading: true,
                    }),
                };
            },
        });
        cy.contains('Loading');
    });

    it('displays user details', () => {
        cy.visit('/profile/1', {
            onBeforeLoad(win) {
                win['graphql-react'] = {
                    useUserById: () => ({
                        loading: false,
                        user: {
                            username: 'test-username',
                            email: 'test-email',
                            firstName: 'test-firstName',
                            lastName: 'test-lastName',
                        },
                    }),
                };
            },
        });
        cy.contains('test-username');
        cy.contains('test-email');
        cy.contains('test-firstName test-lastName');
    });

    it('displays error if no user found', () => {
        cy.visit('/profile/1', {
            onBeforeLoad(win) {
                win['graphql-react'] = {
                    useUserById: () => ({
                        loading: false,
                        user: null,
                    }),
                };
            },
        });
        cy.get('[data-cy=fetch-profile-error]');
    });
});
