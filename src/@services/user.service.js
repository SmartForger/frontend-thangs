import {authHeader, handleResponse} from '@helpers'

const getAll = () => {
  const requestOptions = {method: 'GET', headers: authHeader ()};
  return fetch(`${process.env.REACT_API_KEY}/users`, requestOptions).then(handleResponse);
}

const userService = {
  getAll
}

export {userService};
