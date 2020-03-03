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
});
