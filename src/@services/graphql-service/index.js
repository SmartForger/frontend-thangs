import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { createUploadLink } from 'apollo-upload-client';
import { createAuthenticatedFetch } from '@services/authenticated-fetch';

import * as users from './users';
import * as models from './models';
import * as comments from './comments';
import * as newsposts from './newsposts';
import * as notifications from './notifications';
import { getGraphQLUrl } from './utils';

import { logger } from '../../logging';

export const graphqlClient = (originalFetch, history) =>
    new ApolloClient({
        link: ApolloLink.from([
            onError(({ graphQLErrors, networkError }) => {
                if (graphQLErrors)
                    graphQLErrors.forEach(({ message, locations, path }) =>
                        logger.log(
                            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
                        )
                    );
                if (networkError)
                    logger.log(`[Network error]: ${networkError}`);
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
        ...users,
        ...models,
        ...comments,
        ...newsposts,
        ...notifications,
    };
};

export { getInstance, getGraphQLUrl };
