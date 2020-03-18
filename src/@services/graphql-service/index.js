import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { createUploadLink } from 'apollo-upload-client';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { createAuthenticatedFetch } from '@services/authenticated-fetch';

import {
    useUserById,
    useUpdateUser,
    useUploadUserAvatarMutation,
} from './users';
import {
    useModelById,
    useLikeModelMutation,
    useUnlikeModelMutation,
} from './models';
import { getGraphQLUrl } from './utils';

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

export { getInstance, getGraphQLUrl };
