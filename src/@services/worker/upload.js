import store from '../../store'
import * as types from '@constants/storeEventTypes'

import { sendMessage, addMessageListener } from './worker'

/* Send messages to worker */

export const uploadFiles = (files, directory) => {
  console.log(directory)
  sendMessage('upload:upload', {
    files,
    directory,
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
      store.dispatch(types.VALIDATE_FILES)
      break
    case 'upload:error':
      store.dispatch(types.CHANGE_UPLOAD_FILE, {
        id: data.id,
        data: {
          error: data.error,
        },
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
