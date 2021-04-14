import axios from 'axios'
import storageService from '../@services/storage.service'
import api from './api'
import { sendMessage, addMessageListener } from './worker'

const cancellationTokens = {}

async function uploadSingleFile({ id, file }, uploadedUrlData) {
  cancellationTokens[id] = axios.CancelToken.source()

  try {
    await storageService.uploadToSignedUrl(uploadedUrlData.signedUrl, file, {
      cancelToken: cancellationTokens[id].token,
    })

    delete cancellationTokens[id]

    sendMessage('upload:success', {
      id,
      uploadedUrlData,
    })
  } catch (e) {
    sendMessage('upload:error', { id, error: e.message })
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
      fileIds: files.map(f => f.id),
      uploadedUrlData,
    })

    files.forEach((f, i) => {
      uploadSingleFile(f, uploadedUrlData[i])
    })
  } catch (e) {
    sendMessage('upload:error', { error: e.message })
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
  sendMessage('upload:cancelled', { nodeFileMap, shouldRemove })
}

function uploadMessageHandler(messageType, data) {
  if (messageType === 'upload:upload') {
    uploadMultipleFiles(data)
  } else if (messageType === 'upload:cancel') {
    cancelRequests(data)
  }
}

addMessageListener(uploadMessageHandler)
