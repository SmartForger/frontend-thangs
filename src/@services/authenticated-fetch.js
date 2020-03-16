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

const tryWithRefresh = async (originalFetch, url, options) => {
    await authenticationService.refreshAccessToken();
    const accessToken = localStorage.getItem('accessToken');
    return await originalFetch(url, withAuthHeader(options, accessToken));
};

const createAuthenticatedFetch = originalFetch => {
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
            return tryWithRefresh(originalFetch, url, options);
        }
        return response;
    };
};

export { createAuthenticatedFetch };
