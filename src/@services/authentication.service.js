import {BehaviorSubject} from 'rxjs';
import {handleResponse} from '@helpers';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));



const login = (username, password) => {
  const requestOptions = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({username,password})
  };

  return fetch (`${process.env.REACT_APP_API_KEY}/auth/login`, requestOptions)
  .then(handleResponse)
  .then(user => {
    localStorage.setItem('currentUser', JSON.stringify(user));
    currentUserSubject.next(user);

    return user;
  })
}

const logout = () => {
  localStorage.removeItem('currentUser');
  currentUserSubject.next(null);
}



const authenticationService = {
  login,
  logout,
  currentUser: currentUserSubject.asObservable(), 
  get currentUserValue () {return currentUserSubject.value}
}

export {authenticationService};