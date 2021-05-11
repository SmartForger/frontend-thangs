import * as types from '@constants/workerMessageTypes'

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

export const sendMessage = async (messageType, data = {}) => {
  const w = getWorker()
  const message = { messageType, ...data }
  await w.postMessage(message)
}

export const addMessageListener = listener => {
  listeners.push(listener)
}

function initialize() {
  sendMessage(types.API_SET_BASE_URL, {
    url: process.env.REACT_APP_API_KEY,
  })
}

function workerMessageHandler(e) {
  const { messageType, ...data } = e.data
  listeners.forEach(listener => listener(messageType, data))
}

function logMessageHandler(messageType, data) {
  if (messageType === types.LOG_INFO) {
    // eslint-disable-next-line no-console
    console.log('INFO from worker', data.logData)
  } else if (messageType === types.LOG_WARN) {
    // eslint-disable-next-line no-console
    console.warn('WARNING from worker', data.logData)
  } else if (messageType === types.LOG_ERROR) {
    // eslint-disable-next-line no-console
    console.error('ERROR from worker', data.logData)
  } else if (messageType === types.LOG_ERROR_WITH_TRACE_DATA) {
    // eslint-disable-next-line no-console
    console.error('ERROR from worker', data.file, data.line, data.logData) // TODO: Also log file/line number if present?
  }
}

addMessageListener(logMessageHandler)
