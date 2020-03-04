import { useGraphQL } from 'graphql-react';
import { authenticationService } from '@services/authentication.service';

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
            options.url = authenticationService.getGraphQLUrl();
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

export { getInstance };
