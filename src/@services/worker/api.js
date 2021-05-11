import authenticationService from '../authentication.service'
import { sendMessage, addMessageListener } from './worker'
import * as types from '@constants/workerMessageTypes'

/* Send messages to worker */

export const setToken = token => {
  sendMessage(types.API_SET_TOKEN, {
    token,
  })
}

/* Handle messages from worker */

function apiMessageHandler(messageType) {
  if (messageType === types.API_403) {
    authenticationService.logout()
    window.location.href = '/?sessionExpired=true'
  }
}

addMessageListener(apiMessageHandler)
