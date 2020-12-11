import { sendMessage } from './worker'

export function log(file, line, logData) {
  sendMessage('log', {
    file,
    line,
    logData
  })
}
