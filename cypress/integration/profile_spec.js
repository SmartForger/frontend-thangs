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
                    data: {
                        user: {
                            username: 'test-username',
                            email: 'test-email',
                            firstName: 'test-firstName',
                            lastName: 'test-lastName',
                            profile: {
                                description: 'profile description text',
                                avatar: 'avatar-url',
                            },
                        },
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
    });

    it('displays error if no user found', () => {
        cy.mockOnWindow({
            'graphql-react': {
                useUserById: () => ({
                    loading: false,
                    data: {
                        user: null,
                    },
                }),
            },
        });
        cy.visit('/profile/1');
        cy.get('[data-cy=fetch-profile-error]');
    });
});
