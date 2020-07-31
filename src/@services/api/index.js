import axios from 'axios'

export default ({ method = 'GET', endpoint, body }) => {
  const token = localStorage.getItem('restAccessToken')

  return axios({
    url: `${process.env.REACT_APP_REST_API_KEY}${endpoint}`,
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(method === 'POST' ? { data: JSON.stringify(body) } : {}),
  }).catch(e => Promise.resolve({ data: {}, error: e }))
}