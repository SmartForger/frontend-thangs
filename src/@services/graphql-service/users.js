import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { createAppUrl } from './utils';

export const USER_QUERY = gql`
    query getUser($id: ID) {
        user(id: $id) {
            id
            username
            email
            firstName
            lastName
            fullName
            profile {
                description
                avatarUrl
            }
            models {
                id
                name
                likesCount
                commentsCount
                attachment {
                    id
                    imgSrc
                }
            }
            inviteCode
            likedModels {
                id
                name
                likesCount
                commentsCount
                owner {
                    id
                    fullName
                }
            }
        }
    }
`;

const UPDATE_USER_MUTATION = gql`
    mutation updateUser($updateInput: UpdateUserInput!) {
        updateUser(input: $updateInput) {
            user {
                id
                firstName
                lastName
                fullName
                profile {
                    description
                }
            }
        }
    }
`;

const UPLOAD_USER_PROFILE_AVATAR_MUTATION = gql`
    mutation uploadUserProfileAvatar($userId: ID, $file: Upload!) {
        uploadUserProfileAvatar(userId: $userId, file: $file) {
            user {
                id
                profile {
                    avatarUrl
                }
            }
        }
    }
`;

const parseUser = user => {
    const avatarUrl =
        user.profile && user.profile.avatarUrl
            ? createAppUrl(user.profile.avatarUrl)
            : '';
    return {
        ...user,
        profile: {
            ...user.profile,
            avatarUrl,
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

const useUpdateUser = () => {
    return useMutation(UPDATE_USER_MUTATION);
};

const useUploadUserAvatarMutation = (user, croppedImg) => {
    return useMutation(UPLOAD_USER_PROFILE_AVATAR_MUTATION, {
        variables: {
            file: croppedImg,
            userId: user.id,
        },
    });
};

export { useUserById, useUpdateUser, useUploadUserAvatarMutation, parseUser };
