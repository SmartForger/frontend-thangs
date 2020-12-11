import store from '../../store'
import * as types from '@constants/storeEventTypes'

import { sendMessage, addMessageListener } from './worker'

/* Send messages to worker */

export const uploadFile = (id, file) => {
  sendMessage('upload:upload', {
    id,
    file,
  })
}

export const cancelUpload = id => {
  sendMessage('upload:cancel', { id })
}

/* Handle messages from worker */

function uploadMessageHandler(messageType, data) {
  switch (messageType) {
    case 'upload:success':
      store.dispatch(types.CHANGE_UPLOAD_FILE, {
        id: data.id,
        data: data.uploadedUrlData,
        isLoading: false,
        isError: false,
      })
      break
    case 'upload:error':
      store.dispatch(types.CHANGE_UPLOAD_FILE, {
        id: data.id,
        data: data.error,
        isLoading: false,
        isError: true,
      })
      break
    case 'upload:cancelled':
      store.dispatch(types.REMOVE_UPLOAD_FILES, { index: data.id })
      break
    default:
      break
  }
}

addMessageListener(uploadMessageHandler)
