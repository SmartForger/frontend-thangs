import axios from 'axios'

const uploadToSignedUrl = async (uploadUrl, file, props) => {
  return await axios
    .put(uploadUrl, file, {
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      ...props,
    })
    .catch(e => Promise.reject({ data: {}, error: e }))
}

const storageService = {
  uploadToSignedUrl,
}

export default storageService
