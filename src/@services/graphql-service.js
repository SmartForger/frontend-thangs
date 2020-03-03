import { useGraphQL } from 'graphql-react';

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
            options.url = 'http://127.0.0.1:8000/graphql/';
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
    if (window.Cypress && window['graphql-react']) {
        return window.Cypress && window['graphql-react'];
    }
    return { useUserById };
};

export { getInstance };
