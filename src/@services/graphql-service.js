import { useGraphQL } from 'graphql-react';

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

const userQuery = id => `{
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

const useUserById = id => {
    const { loading, cacheValue = {} } = useGraphQL({
        fetchOptionsOverride(options) {
            const access = localStorage.getItem('accessToken');
            options.url = getGraphQLUrl();
            options.headers = {
                Authorization: `Bearer ${access}`,
                'Content-Type': 'application/json',
            };
        },
        operation: {
            query: userQuery(id),
        },
        loadOnMount: true,
        loadOnReload: true,
        loadOnReset: true,
    });
    const user = cacheValue && cacheValue.data && cacheValue.data.user;
    return { user, loading };
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
