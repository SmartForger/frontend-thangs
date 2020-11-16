import store from '../store'
import authenticationService from './authentication.service'
import * as types from '@constants/storeEventTypes'

let worker = null

const getWorker = () => {
  if (!worker) {
    worker = new Worker('/workers/upload.js')
    worker.addEventListener('message', workerMessageHandler)
  }

  return worker
}

export const uploadFile = (id, file) => {
  const w = getWorker()
  const token = localStorage.getItem('accessToken')
  w.postMessage({
    message: 'upload',
    id,
    file,
    token,
    baseUrl: process.env.REACT_APP_API_KEY,
  })
}

export const cancelUpload = id => {
  const w = getWorker()
  w.postMessage({ message: 'cancel', id })
}

function workerMessageHandler(e) {
  const { message, id } = e.data

  switch (message) {
    case 'success':
      store.dispatch(types.CHANGE_UPLOAD_FILE, {
        id,
        data: e.data.uploadedUrlData,
        isLoading: false,
        isError: false,
      })
      break
    case 'error':
      store.dispatch(types.CHANGE_UPLOAD_FILE, {
        id,
        data: e.data.error,
        isLoading: false,
        isError: true,
      })
      break
    case 'cancelled':
      store.dispatch(types.REMOVE_UPLOAD_FILES, { index: id })
      break
    case 'permissionDenied':
      authenticationService.logout()
      window.location.href = '/?sessionExpired=true'
      break
    case 'log':
      console.log('Worker ', e.data.file, e.data.line, e.data.logData)
      break
    default:
      break
  }
}
