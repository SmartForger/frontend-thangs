import axios from 'axios'
import { log } from './logger'

const apiForChain = ({
  method = 'GET',
  endpoint,
  body,
  cancelToken,
  timeout = 300000,
  params,
  token,
  baseUrl,
}) => {
  return axios({
    url: `${baseUrl}${endpoint}`,
    method,
    cancelToken,
    timeout,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body && { data: JSON.stringify(body) }),
    ...(params && { params }),
  }).catch(e => {
    if (e && e.response && e.response.status === 403) {
      postMessage({ message: 'permissionDenied', body })
    }

    return Promise.reject(e)
  })
}

export default props =>
  apiForChain(props).catch(e => {
    return Promise.resolve({ data: {}, error: e })
  })
