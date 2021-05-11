import axios from 'axios'
import { sendMessage, addMessageListener } from './worker'

let token = ''
let baseUrl = ''

const apiForChain = ({
  method = 'GET',
  endpoint,
  body,
  cancelToken,
  timeout = 300000,
  params,
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
      sendMessage('api:403')
    }

    return Promise.reject(e)
  })
}

export default props =>
  apiForChain(props).catch(e => {
    return Promise.resolve({ data: {}, error: e })
  })

function apiMessageHandler(messageType, data) {
  if (messageType === 'api:setToken') {
    token = data.token
  } else if (messageType === 'api:setBaseUrl') {
    baseUrl = data.url
  }
}

addMessageListener(apiMessageHandler)
