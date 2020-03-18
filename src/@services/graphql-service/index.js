import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { createUploadLink } from 'apollo-upload-client';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { createAuthenticatedFetch } from '@services/authenticated-fetch';

import {
    USER_QUERY,
    UPDATE_USER_MUTATION,
    UPLOAD_USER_PROFILE_AVATAR_MUTATION,
} from './users';
import {
    MODEL_QUERY,
    LIKE_MODEL_MUTATION,
    UNLIKE_MODEL_MUTATION,
} from './models';

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

export const graphqlClient = (originalFetch, history) =>
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
                fetch: createAuthenticatedFetch(originalFetch, history),
                credentials: 'same-origin',
            }),
        ]),
        cache: new InMemoryCache(),
    });

const parseUserPayload = data => {
    if (!data || !data.user) {
        return null;
    }

    const avatar = data.user.profile ? data.user.profile.avatar : '';

    return {
        ...data.user,
        profile: {
            ...data.user.profile,
            avatar: media(avatar),
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
                    },
                },
            });
        },
    });
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
