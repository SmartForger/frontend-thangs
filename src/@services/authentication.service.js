import { BehaviorSubject } from 'rxjs';
import { handleResponse } from '@helpers';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

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
        const user = jwtDecode(refresh);
        delete user.token_type;
        delete user.exp;
        delete user.jti;
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('refreshToken', refresh);
        localStorage.setItem('accessToken', access);
        user.accessToken = access;
        user.refreshToken = refresh;
        currentUserSubject.next(user);
        return response;
    } catch (err) {
        return err.response;
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

function getApiUrl(path) {
    const baseUrl = getBaseUrl();
    const apiPath = withEndSlash(path);
    return new URL(apiPath, baseUrl);
}

const authenticationService = {
    login,
    logout,
    signup,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue() {
        return currentUserSubject.value;
    },
};

export { authenticationService };
