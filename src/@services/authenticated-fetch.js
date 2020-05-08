import * as R from 'ramda';
import { authenticationService } from '@services';

import { logger } from '../logging';

function withAuthHeader(options, accessToken) {
    return {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${accessToken}`,
        },
    };
}

const is500 = R.test(/^5../);
const is400 = R.test(/^4../);

function isErrorResponse(response) {
    return is500(response.status) || is400(response.status);
}
const tryWithRefresh = async (originalFetch, history, url, options) => {
    try {
        await authenticationService.refreshAccessToken();
        const accessToken = localStorage.getItem('accessToken');
        const response = await originalFetch(
            url,
            withAuthHeader(options, accessToken)
        );

        if (isErrorResponse(response)) {
            const error = new Error();
            error.message = `Received ${response.status} when trying to refresh access token`;
            throw error;
        }

        return response;
    } catch (e) {
        logger.error('Error refreshing token', e);
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
            withAuthHeader(options, accessToken)
        );

        if (response.status === 401) {
            return tryWithRefresh(originalFetch, history, url, options);
        }
        return response;
    };
};

export { createAuthenticatedFetch, withAuthHeader };
