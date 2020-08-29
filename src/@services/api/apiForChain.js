import axios from 'axios'
import { authenticationService } from '@services'

export default ({ method = 'GET', endpoint, body, cancelToken, timeout = 300000 }) => {
  const token = localStorage.getItem('accessToken')
  return axios({
    url: `${process.env.REACT_APP_API_KEY}${endpoint}`,
    method,
    cancelToken,
    timeout,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body && { data: JSON.stringify(body) }),
  }).catch(e => {
    if (e && e.response && e.response.status === 403) {
      authenticationService.logout()
      window.location.href = '/login?sessionExpired=true'
    }

    return Promise.reject(e)
  })
}
