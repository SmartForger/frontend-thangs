import axios from 'axios'

export default ({ method = 'GET', endpoint, body, cancelToken, timeout = 300000 }) => {
  const token = localStorage.getItem('restAccessToken')

  return axios({
    url: `${process.env.REACT_APP_REST_API_KEY}${endpoint}`,
    method,
    cancelToken,
    timeout,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body && { data: JSON.stringify(body) }),
  })
}
