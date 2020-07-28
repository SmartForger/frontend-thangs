import axios from 'axios'

const url = 'https://staging-api-platform-dot-thangs.uc.r.appspot.com/'

export default ({ method = 'GET', endpoint, body }) =>
  axios({
    url: `${url}${endpoint}`,
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessTokenRest')}`,
    },
    ...(method === 'POST' ? { data: JSON.stringify(body) } : {}),
  }).catch(e => Promise.resolve({ data: {}, error: e }))
