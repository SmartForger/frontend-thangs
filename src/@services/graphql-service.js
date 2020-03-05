import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { createAuthenticatedFetch } from '@services/authenticated-fetch';
import { authenticationService } from '@services/authentication.service';

const hasEndSlash = /\/$/;

function withEndSlash(path) {
    if (hasEndSlash.test(path)) {
        return path;
    }
    return `${path}/`;
}

function getGraphQLUrl() {
    let url = process.env.REACT_APP_API_KEY;
    const graphqlUrl = url.replace('api', 'graphql');
    return withEndSlash(graphqlUrl);
}

const userQuery = id => gql`{
  user(id: "${id}") {
    id
    username
    email
    firstName
    lastName
    profile {
      description
      avatar
    }
}}`;

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
            new HttpLink({
                uri: getGraphQLUrl(),
                fetch: createAuthenticatedFetch(originalFetch),
                credentials: 'same-origin',
            }),
        ]),
        cache: new InMemoryCache(),
    });

const useUserById = id => {
    return useQuery(userQuery(id));
};

const getInstance = () => {
    // Check the window to see if we have set up a mocked implementation. This
    // allows us to mock these requests from inside the Cypress tests.
    if (window.Cypress && window['graphql-react']) {
        return window['graphql-react'];
    }
    return { useUserById };
};

export { getInstance, getGraphQLUrl };
