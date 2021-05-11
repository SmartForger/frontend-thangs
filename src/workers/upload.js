import axios from 'axios'
import storageService from '../@services/storage.service'
import api from './api'
import { sendMessage, addMessageListener } from './worker'

const cancellationTokens = {}

/* Model files */
async function uploadSingleFile({ id, file }, uploadedUrlData) {
  cancellationTokens[id] = axios.CancelToken.source()

  try {
    await storageService.uploadToSignedUrl(uploadedUrlData.signedUrl, file, {
      cancelToken: cancellationTokens[id].token,
    })

    delete cancellationTokens[id]

    sendMessage('upload:success', {
      // workerMessageTypes.UPLOAD_SUCCESS
      id,
      uploadedUrlData,
    })
  } catch (e) {
    sendMessage('upload:error', { id, error: e.message }) // workerMessageTypes.UPLOAD_ERROR
  }
}

async function uploadMultipleFiles({ files, directory, modelId }) {
  try {
    const { data: uploadedUrlData } = await api({
      method: 'POST',
      endpoint: 'models/upload-urls',
      body: {
        fileNames: files.map(f => f.file.name),
        directory,
        modelId,
      },
    })

    sendMessage('upload:urls', {
      // workerMessageTypes.UPLOAD_URLS
      fileIds: files.map(f => f.id),
      uploadedUrlData,
    })

    files.forEach((f, i) => {
      uploadSingleFile(f, uploadedUrlData[i])
    })
  } catch (e) {
    sendMessage('upload:error', { error: e.message }) // workerMessageTypes.UPLOAD_ERROR
  }
}

function cancelRequest(fileId) {
  if (!cancellationTokens[fileId]) {
    return
  }

  cancellationTokens[fileId].cancel('Upload interrupted')
}

function cancelRequests({ nodeFileMap, shouldRemove }) {
  Object.values(nodeFileMap).forEach(fileId => {
    cancelRequest(fileId)
  })
  sendMessage('upload:cancelled', { nodeFileMap, shouldRemove }) // workerMessageTypes.UPLOAD_CANCELLED
}

/* Attachment files */
async function uploadSingleAttachmentFile({ id, file }, uploadedUrlData) {
  try {
    await storageService.uploadToSignedUrl(uploadedUrlData.signedUrl, file)

    sendMessage('uploadAttachments:success', {
      // workerMessageTypes.UPLOAD_ATTACHMENTS_SUCCESS
      id,
      uploadedUrlData,
    })
  } catch (e) {
    sendMessage('uploadAttachments:error', { id, error: e.message }) // workerMessageTypes.UPLOAD_ATTACHMENTS_ERROR
  }
}

async function uploadMultipleAttachmentFiles({ files, directory }) {
  try {
    const { data: uploadedUrlData } = await api({
      method: 'POST',
      endpoint: 'attachments/upload-urls',
      body: {
        fileNames: files.map(f => f.file.name),
        directory,
      },
    })

    sendMessage('uploadAttachments:urls', {
      // workerMessageTypes.UPLOAD_ATTACHMENTS_URLS
      fileIds: files.map(f => f.id),
      uploadedUrlData,
    })

    files.forEach((f, i) => {
      uploadSingleAttachmentFile(f, uploadedUrlData[i])
    })
  } catch (e) {
    sendMessage('uploadAttachments:error', { error: e.message }) // workerMessageTypes.UPLOAD_ATTACHMENTS_ERROR
  }
}

/* Message handling */
function uploadMessageHandler(messageType, data) {
  switch (messageType) {
    case 'upload:upload': // workerMessageTypes.UPLOAD_UPLOAD
      uploadMultipleFiles(data)
      break
    case 'upload:cancel': // workerMessageTypes.UPLOAD_CANCEL
      cancelRequests(data)
      break
    case 'uploadAttachments:upload': // workerMessageTypes.UPLOAD_ATTACHMENTS_UPLOAD
      uploadMultipleAttachmentFiles(data)
      break
    default:
      break
  }
}

addMessageListener(uploadMessageHandler)
