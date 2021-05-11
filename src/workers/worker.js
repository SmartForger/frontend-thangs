import { logError } from './logger'

const listeners = []

export const sendMessage = (messageType, data) => {
  postMessage({
    messageType,
    ...data,
  })
}

export const addMessageListener = listener => {
  listeners.push(listener)
}

export const initialize = () => {
  onmessage = message => {
    const { messageType, ...data } = message.data
    listeners.forEach(listener => listener(messageType, data))
  }
  onerror = error => {
    logError('General error:')
    logError(error)
  }
  onmessageerror = error => {
    logError('Message error:')
    logError(error)
  }
}
