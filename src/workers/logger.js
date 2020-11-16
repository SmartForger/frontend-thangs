export function log(file, line, logData) {
  postMessage({
    message: 'log',
    file,
    line,
    logData,
  })
}
