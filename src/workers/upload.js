import axios from 'axios'
import storageService from '../@services/storage.service'
import api from './api'
import { log } from './logger'

const cancellationTokens = {}

log('upload.js', 8, `Worker started`)

onmessage = e => {
  const { message, id, file, token, baseUrl } = e.data

  switch (message) {
    case 'upload':
      handleFileUpload(id, file, token, baseUrl)
        .then(uploadedUrlData => {
          postMessage({ message: 'success', id, uploadedUrlData })
        })
        .catch(e => {
          postMessage({ message: 'error', error: e.message })
        })
      break
    case 'cancel':
      cancelRequest(id)
      break
    default:
      break
  }
}

async function handleFileUpload(id, file, token, baseUrl) {
  cancellationTokens[id] = axios.CancelToken.source()

  try {
    log('upload.js', 35, `Before API`)

    const { data: uploadedUrlData } = await api({
      method: 'GET',
      endpoint: `models/upload-url?fileName=${file.name}`,
      cancelToken: cancellationTokens[id].token,
      token,
      baseUrl,
    })

    log('upload.js', 45, `After API`)

    await storageService.uploadToSignedUrl(uploadedUrlData.signedUrl, file, {
      cancelToken: cancellationTokens[id].token,
    })

    delete cancellationTokens[id]

    return uploadedUrlData
  } catch (e) {
    log('upload.js', 55, e)
    delete cancellationTokens[id]
    throw e
  }
}

function cancelRequest(id) {
  log('upload.js', 61, `Cancel Upload ${id}`)
  if (!cancellationTokens[id]) {
    postMessage({ message: 'cancelled', id })
    return
  }
  cancellationTokens[id].cancel('Upload interrupted')
  postMessage({ message: 'cancelled', id })
}
