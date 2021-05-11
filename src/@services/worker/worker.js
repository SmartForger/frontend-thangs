let worker = null
const listeners = []

export const getWorker = () => {
  if (!worker) {
    worker = new Worker('/workers/index.js')
    worker.addEventListener('message', workerMessageHandler)

    initialize(worker)
  }

  return worker
}

export const sendMessage = (messageType, data) => {
  const w = getWorker()
  w.postMessage({ messageType, ...data })
}

export const addMessageListener = listener => {
  listeners.push(listener)
}

function initialize() {
  sendMessage('api:setBaseUrl', {
    url: process.env.REACT_APP_API_KEY,
  })
}

function workerMessageHandler(e) {
  const { messageType, ...data } = e.data
  listeners.forEach(listener => listener(messageType, data))
}

function logMessageHandler(messageType, data) {
  if (messageType === 'log') {
    // eslint-disable-next-line no-console
    console.log('Worker ', data.file, data.line, data.logData)
  }
}

addMessageListener(logMessageHandler)
