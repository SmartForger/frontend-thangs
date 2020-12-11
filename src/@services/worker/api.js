import authenticationService from '../authentication.service'
import { sendMessage, addMessageListener } from './worker'

/* Send messages to worker */

export const setToken = token => {
  sendMessage('api:setToken', {
    token,
  })
}

/* Handle messages from worker */

function apiMessageHandler(messageType, data) {
  if (messageType === 'api:403') {
    authenticationService.logout()
    window.location.href = '/?sessionExpired=true'
  }
}

addMessageListener(apiMessageHandler)
