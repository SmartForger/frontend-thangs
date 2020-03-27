import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { media } from './utils';

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
            models {
                id
                name
            }
            inviteCode
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

const parseUser = user => {
    const avatar = user.profile ? user.profile.avatar : '';
    return {
        ...user,
        profile: {
            ...user.profile,
            avatar: media(avatar),
        },
    };
};

const parseUserPayload = data => {
    if (!data || !data.user) {
        return null;
    }

    return parseUser(data.user);
};

const useUserById = id => {
    const { loading, error, data } = useQuery(USER_QUERY, {
        variables: { id },
    });
    const user = parseUserPayload(data);

    return { loading, error, user };
};

const useUpdateUser = user => {
    return useMutation(UPDATE_USER_MUTATION, {
        // We need this update mechanism because our user query returns a
        // different data representation than the profile mutation. This messes
        // up Apollo's caching, so we need to handle it ourselves.
        update: (store, { data: { updateUser } }) => {
            store.writeQuery({
                query: USER_QUERY,
                variables: { id: updateUser.id },
                data: {
                    user: {
                        ...updateUser,
                        email: user.email,
                        username: user.username,
                        models: user.models,
                        inviteCode: user.inviteCode,
                    },
                },
            });
        },
    });
};

const useUploadUserAvatarMutation = (user, croppedImg) => {
    return useMutation(UPLOAD_USER_PROFILE_AVATAR_MUTATION, {
        variables: {
            file: croppedImg,
            userId: user.id,
        },
        // We need this update mechanism because our user query returns a
        // string id, while the user mutation returns an integer id.
        // This messes up Apollo's caching, so we need to handle it ourselves.
        update: (
            store,
            {
                data: {
                    uploadUserProfileAvatar: { user: updatedUser },
                },
            },
        ) => {
            store.writeQuery({
                query: USER_QUERY,
                variables: { id: `${user.id}` },
                data: {
                    user: {
                        ...updatedUser,
                        email: user.email,
                        username: user.username,
                        models: user.models,
                        inviteCode: user.inviteCode,
                    },
                },
            });
        },
    });
};

export { useUserById, useUpdateUser, useUploadUserAvatarMutation, parseUser };
