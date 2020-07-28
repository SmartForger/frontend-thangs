import axios from 'axios'
import { getRestApiUrl } from '../authentication.service'

export default ({ method = 'GET', endpoint, body }) =>
  axios({
    url: getRestApiUrl(endpoint),
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('restAccessToken')}`,
    },
    ...(method === 'POST' ? { data: JSON.stringify(body) } : {}),
  }).catch(e => Promise.resolve({ data: {}, error: e }))
