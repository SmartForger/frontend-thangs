import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { createUploadLink } from 'apollo-upload-client';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { createAuthenticatedFetch } from '@services/authenticated-fetch';

const hasEndSlash = /\/$/;

const media = path => {
    const url = process.env.REACT_APP_API_KEY;
    const mediaUrl = url.replace('api', 'media');
    return `${mediaUrl}/${path}`;
};

function withEndSlash(path) {
    if (hasEndSlash.test(path)) {
        return path;
    }
    return `${path}/`;
}

function getGraphQLUrl() {
    const url = process.env.REACT_APP_API_KEY;
    const graphqlUrl = url.replace('api', 'graphql');
    return withEndSlash(graphqlUrl);
}

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
            email
            username
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
    }
`;

const MODEL_QUERY = gql`
    query getModel($id: ID) {
        model(id: $id) {
            id
            name
            likes {
                isLiked
                owner {
                    id
                    firstName
                    lastName
                }
            }
            owner {
                firstName
                lastName
            }
        }
    }
`;

const LIKE_MODEL_MUTATION = gql`
    mutation likeModel($userId: ID, $modelId: ID) {
        likeModel(userId: $userId, modelId: $modelId) {
            user {
                id
                firstName
                lastName
                profile {
                    description
                    avatar
                }
            }
            model {
                id
                name
                likes {
                    isLiked
                    owner {
                        id
                        firstName
                        lastName
                    }
                }
                owner {
                    firstName
                    lastName
                }
            }
            like {
                id
            }
        }
    }
`;

const UNLIKE_MODEL_MUTATION = gql`
    mutation unlikeModel($userId: ID, $modelId: ID) {
        unlikeModel(userId: $userId, modelId: $modelId) {
            user {
                id
                firstName
                lastName
                profile {
                    description
                    avatar
                }
            }
            model {
                id
                name
                likes {
                    isLiked
                    owner {
                        id
                        firstName
                        lastName
                    }
                }
                owner {
                    firstName
                    lastName
                }
            }
            like {
                id
            }
        }
    }
`;

export const graphqlClient = originalFetch =>
    new ApolloClient({
        link: ApolloLink.from([
            onError(({ graphQLErrors, networkError }) => {
                if (graphQLErrors)
                    graphQLErrors.forEach(({ message, locations, path }) =>
                        console.log(
                            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
                        ),
                    );
                if (networkError)
                    console.log(`[Network error]: ${networkError}`);
            }),
            createUploadLink({
                uri: getGraphQLUrl(),
                fetch: createAuthenticatedFetch(originalFetch),
                credentials: 'same-origin',
            }),
        ]),
        cache: new InMemoryCache(),
    });

const parseUserPayload = data => {
    if (!data || !data.user) {
        return null;
    }

    return {
        ...data.user,
        profile: {
            ...data.user.profile,
            avatar: media(data.user.profile.avatar),
        },
    };
};

const parseModelPayload = data => {
    if (!data || !data.model) {
        return null;
    }

    return {
        ...data.model,
    };
};

const useUserById = id => {
    const { loading, error, data } = useQuery(USER_QUERY, {
        variables: { id },
    });
    const user = parseUserPayload(data);

    return { loading, error, user };
};

const useModelById = id => {
    const { loading, error, data } = useQuery(MODEL_QUERY, {
        variables: { id },
    });
    const model = parseModelPayload(data);

    return { loading, error, model };
};

const useUpdateUser = () => {
    return useMutation(UPDATE_USER_MUTATION);
};

const useUploadUserAvatarMutation = () => {
    return useMutation(UPLOAD_USER_PROFILE_AVATAR_MUTATION);
};

const useLikeModelMutation = (userId, modelId) => {
    return useMutation(LIKE_MODEL_MUTATION, {
        variables: { userId, modelId },
        update: (
            store,
            {
                data: {
                    likeModel: { model },
                },
            },
        ) => {
            store.writeQuery({
                query: MODEL_QUERY,
                variables: { id: `${model.id}` },
                data: { model },
            });
        },
    });
};

const useUnlikeModelMutation = (userId, modelId) => {
    return useMutation(UNLIKE_MODEL_MUTATION, {
        variables: { userId, modelId },
        update: (
            store,
            {
                data: {
                    unlikeModel: { model },
                },
            },
        ) => {
            store.writeQuery({
                query: MODEL_QUERY,
                variables: { id: `${model.id}` },
                data: { model },
            });
        },
    });
};

const getInstance = () => {
    // Check the window to see if we have set up a mocked implementation. This
    // allows us to mock these requests from inside the Cypress tests.
    if (window.Cypress && window['graphql-react']) {
        return window['graphql-react'];
    }
    return {
        useUserById,
        useUpdateUser,
        useUploadUserAvatarMutation,
        useModelById,
        useLikeModelMutation,
        useUnlikeModelMutation,
    };
};

export { getInstance, getGraphQLUrl, USER_QUERY };
