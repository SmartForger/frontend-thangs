import { BehaviorSubject } from 'rxjs';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { getGraphQLUrl } from './graphql-service';
import * as pendo from '@vendors/pendo';
import * as fullStory from '@vendors/full-story';

const currentUserSubject = new BehaviorSubject(
    JSON.parse(localStorage.getItem('currentUser'))
);

const login = async ({ email, password }) => {
    const requestOptions = {
        url: getApiUrl(`login`),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({ email, password }),
    };

    try {
        const response = await axios(requestOptions);
        const { refresh, access } = response.data;
        const decoded = jwtDecode(refresh);
        const user = {
            id: `${decoded['user_id']}`,
            username: decoded.username,
            email: decoded.email,
        };

        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('refreshToken', refresh);
        localStorage.setItem('accessToken', access);
        user.accessToken = access;
        user.refreshToken = refresh;
        currentUserSubject.next(user);
        pendo.identify();
        fullStory.identify();
        return response;
    } catch (err) {
        if (err.response) {
            return err.response;
        }
        return {
            status: 500,
            data: {
                detail: 'Internal Server Error, please try again',
            },
        };
    }
};

const signup = async ({
    email,
    password,
    registration_code,
    first_name,
    last_name,
    username,
}) => {
    const requestOptions = {
        url: getApiUrl('users'),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({
            email,
            password,
            registration_code,
            first_name,
            last_name,
            username,
        }),
    };

    try {
        const data = await axios(requestOptions);
        return data;
    } catch (err) {
        return err.response;
    }
};

const logout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    currentUserSubject.next(null);
};

const hasEndSlash = /\/$/;

function withEndSlash(path) {
    if (hasEndSlash.test(path)) {
        return path;
    }
    return `${path}/`;
}

function getBaseUrl() {
    let url = process.env.REACT_APP_API_KEY;
    return withEndSlash(url);
}

function isGraphQLUrl(url) {
    const graphqlUrl = getGraphQLUrl();
    return url.includes(graphqlUrl);
}

function getApiUrl(path) {
    const baseUrl = getBaseUrl();
    const apiPath = withEndSlash(path);
    return new URL(apiPath, baseUrl);
}

// This singleton Promise acts as a mutex to ensure we only have one refresh
// token request in-flight at any given time.
let refreshingAccessToken = null;
const refreshAccessToken = async () => {
    if (!refreshingAccessToken) {
        refreshingAccessToken = _refreshToken();
    }
    return await refreshingAccessToken;
};

const _refreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');

    const url = getApiUrl(`token/refresh/`);

    const response = await axios.post(url, { refresh: refreshToken });
    const { access } = response.data;

    // TODO: extract this away into an `updateUser()` function
    const user = currentUserSubject.value;
    user.accessToken = access;
    currentUserSubject.next(user);
    localStorage.setItem('accessToken', access);

    return response;
};

const resetPasswordForEmail = async email => {
    const url = getApiUrl(`password_reset/`);
    return axios.post(url, { email });
};

const setPasswordForReset = async ({
    token,
    userId,
    password,
    confirmPassword,
}) => {
    const url = getApiUrl(`password_reset_confirm/`);
    return axios.post(url, {
        token,
        uidb64: userId,
        password,
        confirm_password: confirmPassword,
    });
};

const authenticationService = {
    login,
    logout,
    signup,
    getGraphQLUrl,
    isGraphQLUrl,
    refreshAccessToken,
    resetPasswordForEmail,
    setPasswordForReset,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue() {
        return currentUserSubject.value;
    },
};

export { authenticationService };
