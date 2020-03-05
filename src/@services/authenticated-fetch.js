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
            await authenticationService.refreshAccessToken();
            const accessToken = localStorage.getItem('accessToken');
            return await originalFetch(
                url,
                withAuthHeader(options, accessToken),
            );
        }
        return response;
    };
};

export { createAuthenticatedFetch };
