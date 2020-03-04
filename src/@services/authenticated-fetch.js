import { authenticationService } from '@services';

const createAuthenticatedFetch = originalFetch => {
    return async (url, options) => {
        if (!authenticationService.isGraphQLUrl(url)) {
            return originalFetch(url, options);
        }

        const response = await originalFetch(url, options);
        if (response.status === 401) {
            await authenticationService.refreshAccessToken();
            const accessToken = localStorage.getItem('accessToken');
            return await originalFetch(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    ...options.headers,
                },
                ...options,
            });
        }
        return response;
    };
};

export { createAuthenticatedFetch };
