const NOOP = () => null;

describe('The Profile Page', () => {
    it('starts out in loading state', () => {
        cy.mockOnWindow({
            'graphql-react': {
                useUserById: () => ({
                    loading: true,
                }),
            },
        });
        cy.visit('/profile/1');
        cy.contains('Loading');
    });

    it('displays user details', () => {
        cy.mockOnWindow({
            'graphql-react': {
                useUserById: () => ({
                    loading: false,
                    user: {
                        username: 'test-username',
                        email: 'test-email',
                        firstName: 'test-firstName',
                        lastName: 'test-lastName',
                        profile: {
                            description:
                                'test description of a user user profile',
                            avatar: 'avatar-url',
                        },
                        models: [
                            { id: 1, name: 'test-model' },
                            { id: 1, name: 'test-model' },
                            { id: 1, name: 'test-model' },
                        ],
                    },
                }),
                useUploadUserAvatarMutation: () => {
                    return [NOOP, {}];
                },
            },
        });
        cy.visit('/profile/1');
        cy.contains('test-username');
        cy.contains('test-email');
        cy.contains('test-firstName test-lastName');
        cy.get('[data-cy=profile-model-link]').should('have.length', 3);
    });

    it('displays error if no user found', () => {
        cy.mockOnWindow({
            'graphql-react': {
                useUserById: () => ({
                    loading: false,
                    user: null,
                }),
            },
        });
        cy.visit('/profile/1');
        cy.get('[data-cy=fetch-profile-error]');
    });
});
