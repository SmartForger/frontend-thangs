import axios from 'axios'
import { authenticationService } from '@services'

export default ({ method = 'GET', endpoint, body }) => {
  const token = localStorage.getItem('restAccessToken')

  return axios({
    url: `${process.env.REACT_APP_REST_API_KEY}${endpoint}`,
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body && { data: JSON.stringify(body) }),
  }).catch(error => {
    if (error.response.status === 403) {
      authenticationService.logout()
      window.location.href = '/login?sessionExpired=true'
    }
    return error
  })
}
