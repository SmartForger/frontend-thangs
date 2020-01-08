import {authHeader, handleResponse} from '@helpers'

const requestOptions = {method: 'GET', headers: authHeader ()};

/**
 * @param [none]
 * @return {Promise<Array<Object>>} All users in the DB
 */
const getAll = () => {
  return fetch(`${process.env.REACT_API_KEY}/users`, requestOptions).then(handleResponse);
}

const userService = {
  getAll
}

export {userService};
