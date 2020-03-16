import { authenticationService } from '@services';

function withAuthHeader(options, accessToken) {
    return {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${accessToken}`,
        },
    };
}

const tryWithRefresh = async (originalFetch, history, url, options) => {
    try {
        await authenticationService.refreshAccessToken();
        const accessToken = localStorage.getItem('accessToken');
        const response = await originalFetch(
            url,
            withAuthHeader(options, accessToken),
        );

        return response;
    } catch {
        console.log('in logout');
        authenticationService.logout();
        history.push('/login');
        return null;
    }
};

const createAuthenticatedFetch = (originalFetch, history) => {
    return async (url, options) => {
        if (!authenticationService.isGraphQLUrl(url)) {
            return originalFetch(url, options);
        }

        const accessToken = localStorage.getItem('accessToken');
        const response = await originalFetch(
            url,
            withAuthHeader(options, accessToken),
        );

        if (response.status === 401) {
            return tryWithRefresh(originalFetch, history, url, options);
        }
        return response;
    };
};

export { createAuthenticatedFetch };
