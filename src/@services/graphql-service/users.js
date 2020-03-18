import { gql } from 'apollo-boost';

const USER_QUERY = gql`
    query getUser($id: ID) {
        user(id: $id) {
            id
            username
            email
            firstName
            lastName
            profile {
                description
                avatar
            }
        }
    }
`;

const UPDATE_USER_MUTATION = gql`
    mutation updateUser($updateInput: UpdateUserInput!) {
        updateUser(input: $updateInput) {
            id
            firstName
            lastName
            profile {
                description
                avatar
            }
            errors {
                field
                messages
            }
        }
    }
`;

const UPLOAD_USER_PROFILE_AVATAR_MUTATION = gql`
    mutation uploadUserProfileAvatar($userId: ID, $file: Upload!) {
        uploadUserProfileAvatar(userId: $userId, file: $file) {
            user {
                id
                firstName
                lastName
                profile {
                    description
                    avatar
                }
            }
        }
    }
`;

export {
    USER_QUERY,
    UPDATE_USER_MUTATION,
    UPLOAD_USER_PROFILE_AVATAR_MUTATION,
};
