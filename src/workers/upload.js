import axios from 'axios'
import * as R from 'ramda'
import storageService from '../@services/storage.service'
import api from './api'
import { sendMessage, addMessageListener } from './worker'
import { log } from './logger'

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

async function uploadMultipleFiles(files) {
  try {
    const { data: uploadedUrlData } = await api({
      method: 'POST',
      endpoint: 'models/upload-urls',
      body: {
        fileNames: files.map(f => f.file.name),
      },
    })

    files.forEach((f, i) => {
      uploadSingleFile(f, uploadedUrlData[i])
    })
  } catch (e) {
    sendMessage('upload:error', { error: e.message })
  }
}

function cancelRequest(id) {
  if (!cancellationTokens[id]) {
    sendMessage('upload:cancelled', { id })
    return
  }

  cancellationTokens[id].cancel('Upload interrupted')
  sendMessage('upload:cancelled', { id })
}

function uploadMessageHandler(messageType, data) {
  if (messageType === 'upload:upload') {
    uploadMultipleFiles(data.files)
  } else if (messageType === 'upload:cancel') {
    cancelRequest(data.id)
  }
}

addMessageListener(uploadMessageHandler)
