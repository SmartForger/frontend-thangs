import axios from 'axios'
import storageService from '../@services/storage.service'
import api from './api'
import { sendMessage, addMessageListener } from './worker'

const cancellationTokens = {}

async function handleFileUpload(id, file) {
  cancellationTokens[id] = axios.CancelToken.source()

  try {
    const { data: uploadedUrlData } = await api({
      method: 'GET',
      endpoint: `models/upload-url?fileName=${file.name}`,
      cancelToken: cancellationTokens[id].token,
    })

    await storageService.uploadToSignedUrl(uploadedUrlData.signedUrl, file, {
      cancelToken: cancellationTokens[id].token,
    })

    delete cancellationTokens[id]

    sendMessage('upload:success', {
      id,
      uploadedUrlData,
    })
  } catch (e) {
    sendMessage('upload:error', { error: e.message })
  }

  delete cancellationTokens[id]
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
    handleFileUpload(data.id, data.file)
  } else if (messageType === 'upload:cancel') {
    cancelRequest(data.id)
  }
}

addMessageListener(uploadMessageHandler)
