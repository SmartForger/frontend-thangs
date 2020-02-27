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

const signup = ({ email, password }) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    };

    const url = getApiUrl('users');
    return fetch(url, requestOptions)
        .then(handleResponse)
        .then(user => {
            // localStorage.setItem('currentUser', JSON.stringify(user));
            // currentUserSubject.next(user);
            // return user;
        });
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

// const currentUser = JSON.parse(localStorage.getItem('currentUser'));

// const login = ({username, password}) => {
//   const requestOptions = {
//     method: 'POST',
//     headers: {'Content-Type': 'application/json'},
//     body: JSON.stringify({username,password})
//   };

//   return fetch (`${process.env.REACT_APP_API_KEY}/auth/login`, requestOptions)
//   .then(handleResponse)
//   .then(user => {
//     localStorage.setItem('currentUser', JSON.stringify(user));
//     currentUser = user;

//     return user;
//   })
// }

// const logout = () => {
//   localStorage.removeItem('currentUser');
//   currentUser = null;
// }

// const authenticationService = {
//   login,
//   logout,
//   currentUser,
//   get currentUserValue () {return currentUser}
// }

// export {authenticationService};
