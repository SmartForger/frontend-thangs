import { authenticationService } from '@services';

const createAuthenticatedFetch = originalFetch => {
    return async (url, options) => {
        // TODO: Need to implement this fallback in case of different endpoint.
        // if (baseUrl(url) !== authenticationService.getApiUrl('/')) {
        //     return window.fetch(url, options)
        // }

        const response = await originalFetch(url, options);
        if (response.status === 401) {
            const accessToken = localStorage.getItem('accessToken');

            await authenticationService.refreshAccessToken();
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
