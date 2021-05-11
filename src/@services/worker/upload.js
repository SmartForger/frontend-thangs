import store from '../../store'
import * as types from '@constants/storeEventTypes'
import * as workerMessageTypes from '@constants/workerMessageTypes'

import { sendMessage, addMessageListener } from './worker'

/* Send messages to worker */

/* Model files */
export const uploadFiles = ({ files, directory, modelId }) => {
  sendMessage(workerMessageTypes.UPLOAD_UPLOAD, {
    files,
    directory,
    modelId,
  })
}

export const cancelUpload = (nodeFileMap, shouldRemove) => {
  sendMessage(workerMessageTypes.UPLOAD_CANCEL, { nodeFileMap, shouldRemove })
}

/* Attachment files */
export const uploadAttachmentFiles = (files, directory) => {
  sendMessage(workerMessageTypes.UPLOAD_ATTACHMENTS_UPLOAD, {
    files,
    directory,
  })
}

/* Handle messages from worker */
function uploadMessageHandler(messageType, data) {
  switch (messageType) {
    case workerMessageTypes.UPLOAD_SUCCESS:
      store.dispatch(types.CHANGE_UPLOAD_FILE, {
        id: data.id,
        data: data.uploadedUrlData,
        isLoading: false,
        isError: false,
      })
      store.dispatch(types.VALIDATE_FILES)
      break
    case workerMessageTypes.UPLOAD_URLS:
      store.dispatch(types.SET_UPLOADED_URLS, data)
      break
    case workerMessageTypes.UPLOAD_ERROR:
      store.dispatch(types.CHANGE_UPLOAD_FILE, {
        id: data.id,
        data: {
          error: data.error,
        },
        isLoading: false,
        isError: true,
      })
      break
    case workerMessageTypes.UPLOAD_CANCELLED:
      store.dispatch(types.REMOVE_UPLOAD_FILES, data)
      break
    case workerMessageTypes.UPLOAD_ATTACHMENTS_SUCCESS:
      store.dispatch(types.CHANGE_UPLOAD_ATTACHMENT_FILE, {
        id: data.id,
        data: data.uploadedUrlData,
        isLoading: false,
        isError: false,
      })
      break
    case workerMessageTypes.UPLOAD_ATTACHMENTS_URLS:
      store.dispatch(types.SET_UPLOADED_ATTACHMENT_URLS, data)
      break
    case workerMessageTypes.UPLOAD_ATTACHMENTS_ERROR:
      store.dispatch(types.CHANGE_UPLOAD_ATTACHMENT_FILE, {
        id: data.id,
        data: {
          error: data.error,
        },
        isLoading: false,
        isError: true,
      })
      break
    default:
      break
  }
}

addMessageListener(uploadMessageHandler)
