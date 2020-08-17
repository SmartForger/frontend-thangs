import axios from 'axios'

const intervalRequest = (fn, opts = {}) => {
  const { interval = 1000, timeout = 300000 } = opts
  let intervalRef
  let timeoutRef
  let cancelToken = axios.CancelToken.source()
  const cleanUp = () => {
    clearInterval(intervalRef)
    clearTimeout(timeoutRef)
    cancelToken.cancel()
  }

  return (...args) => {
    cleanUp()
    cancelToken = axios.CancelToken.source()

    return new Promise((resolve, reject) => {
      const resolveWrapper = (...data) => {
        cleanUp()
        resolve(...data)
      }
      const rejectWrapper = error => {
        if (!axios.isCancel(error)) {
          cleanUp()
          reject(error)
        }
      }
      timeoutRef = setTimeout(() => {
        rejectWrapper({ error: 'interval request timed out' })
      }, timeout)

      intervalRef = setInterval(() => {
        fn(...args)(resolveWrapper, rejectWrapper, cancelToken.token)
      }, interval)
    })
  }
}

export default intervalRequest
