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
  onmessage = e => {
    const { messageType, ...data } = e.data
    listeners.forEach(listener => listener(messageType, data))
  }
}
