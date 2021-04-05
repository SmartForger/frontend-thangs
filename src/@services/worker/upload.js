import store from '../../store'
import * as types from '@constants/storeEventTypes'

import { sendMessage, addMessageListener } from './worker'

/* Send messages to worker */

export const uploadFiles = (files, directory) => {
  sendMessage('upload:upload', {
    files,
    directory,
  })
}

export const cancelUpload = (nodeFileMap, shouldRemove) => {
  sendMessage('upload:cancel', { nodeFileMap, shouldRemove })
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
      // TODO: Use separate message types for attachment files and model files
      store.dispatch(types.CHANGE_UPLOAD_ATTACHMENT_FILE, {
        id: data.id,
        data: data.uploadedUrlData,
        isLoading: false,
        isError: false,
      })
      store.dispatch(types.VALIDATE_FILES)
      break
    case 'upload:urls':
      store.dispatch(types.SET_UPLOADED_URLS, data)
      store.dispatch(types.SET_UPLOADED_ATTACHMENT_URLS, data)
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
      store.dispatch(types.REMOVE_UPLOAD_FILES, data)
      break
    default:
      break
  }
}

addMessageListener(uploadMessageHandler)
