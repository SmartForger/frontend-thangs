import { BehaviorSubject } from 'rxjs';
import { handleResponse } from '@helpers';
import jwtDecode from 'jwt-decode';

const currentUserSubject = new BehaviorSubject(
    JSON.parse(localStorage.getItem('currentUser'))
);

const login = ({ email, password }) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    };

    const url = getApiUrl(`login`);
    return fetch(url, requestOptions)
        .then(handleResponse)
        .then(({ refresh, access }) => {
            const user = jwtDecode(refresh);
            console.log(jwtDecode(refresh));
            delete user.token_type;
            delete user.exp;
            delete user.jti;
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('refreshToken', refresh);
            localStorage.setItem('accessToken', access);
            user.accessToken = access;
            user.refreshToken = refresh;
            currentUserSubject.next(user);

            return user;
        });
};

const signup = ({
    email,
    password,
    registration_code,
    first_name,
    last_name,
}) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email,
            password,
            registration_code,
            first_name,
            last_name,
        }),
    };

    const url = getApiUrl('users');
    return fetch(url, requestOptions)
        .then(handleResponse)
        .then(user => {
            localStorage.setItem('currentUser', JSON.stringify(user));
            currentUserSubject.next(user);

            return user;
        })
        .catch(error => error);
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
