import axios from 'axios'

const uploadToSignedUrl = async (uploadUrl, file, props) => {
  // let contentType = 'application/octet-stream'
  // let filenameSegments = file && file.name && file.name.split('.')
  // let fileType = filenameSegments.pop().toLowerCase()
  // if (fileType === 'txt') contentType = 'text/plain'
  // if (fileType === 'md') contentType = 'text/markdown'
  // if (fileType === 'pdf') contentType = 'application/pdf'

  return await axios
    .put(uploadUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
      ...props,
    })
    .catch(e => Promise.reject({ data: {}, error: e }))
}

const storageService = {
  uploadToSignedUrl,
}

export default storageService
