import axios from 'axios'

const uploadToSignedUrl = async (uploadUrl, file) => {
  return await axios
    .put(uploadUrl, file, {
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    })
    .catch(e => Promise.reject({ data: {}, error: e }))
}

const storageService = {
  uploadToSignedUrl,
}

export default storageService
