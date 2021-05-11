import { sendMessage } from './worker'

// console logging does not work in web workers, so these methods are used to delegate
// logging back to the client app.

export function logInfo(logData) {
  sendMessage('log:info', { logData }) // workerMessageTypes.LOG_INFO
}

export function logWarn(logData) {
  sendMessage('log:warn', { logData }) // workerMessageTypes.LOG_WARN
}

export function logError(logData) {
  sendMessage('log:error', { logData }) // workerMessageTypes.LOG_ERROR
}

export function logErrorWithTraceData({ file, line, logData }) {
  sendMessage('log:errorWithTraceData', {
    // workerMessageTypes.LOG_ERROR_WITH_TRACE_DATA
    file,
    line,
    logData,
  })
}
