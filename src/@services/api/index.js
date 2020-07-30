import axios from 'axios'
import { getRestApiUrl } from '../authentication.service'

export default ({ method = 'GET', endpoint, body }) => {
  const token = localStorage.getItem('restAccessToken')

  return axios({
    url: getRestApiUrl(endpoint),
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(method === 'POST' ? { data: JSON.stringify(body) } : {}),
  }).catch(e => Promise.resolve({ data: {}, error: e }))
}