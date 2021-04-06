import * as types from '@constants/storeEventTypes'
import { api, uploadFiles, cancelUpload } from '@services'

const getInitAtom = () => ({
  isLoading: false,
  isError: false,
  data: {},
  formData: {},
  fileData: [],
  attachments: [],
})

const noop = () => null

export default store => {
  store.on(types.STORE_INIT, () => ({
    uploadAttachmentFiles: getInitAtom(),
  }))

  store.on(types.RESET_UPLOAD_FILES, () => ({
    uploadAttachmentFiles: getInitAtom(),
  }))

  store.on(types.SUBMITTING_ATTACHMENTS, state => {
    return {
      uploadAttachmentFiles: {
        ...state.uploadAttachmentFiles,
        isLoading: true,
      },
    }
  })

  store.on(types.SUBMIT_ATTACHMENTS_FAILED, state => {
    return {
      uploadAttachmentFiles: {
        ...state.uploadAttachmentFiles,
        isLoading: false,
        isError: true,
      },
    }
  })

  store.on(types.INIT_UPLOAD_ATTACHMENT_FILES, (state, { files }) => {
    const newFilesMap = files.reduce(
      (newFiles, f) => ({
        ...newFiles,
        [f.id]: {
          id: f.id,
          name: f.file.name,
          size: f.file.size,
          error: f.errorState && f.errorState.message,
          isLoading: f.errorState && f.errorState.error ? false : true,
          isError: f.errorState && f.errorState.error,
          isWarning: f.errorState && f.errorState.warning,
        },
      }),
      {}
    )

    return {
      uploadAttachmentFiles: {
        ...state.uploadAttachmentFiles,
        fileData: files,
        data: {
          ...state.uploadAttachmentFiles.data,
          ...newFilesMap,
        },
        isLoading: false,
      },
    }
  })

  store.on(types.SET_UPLOADED_ATTACHMENT_URLS, (state, { fileIds, uploadedUrlData }) => {
    const { data: uploadedFiles } = state.uploadAttachmentFiles

    fileIds.forEach((fileId, i) => {
      uploadedFiles[fileId] = {
        ...uploadedFiles[fileId],
        ...uploadedUrlData[i],
      }
    })

    return {
      uploadAttachmentFiles: {
        ...state.uploadAttachmentFiles,
        isLoading: true,
      }
    }
  })

  // TODO[MARCEL]: Rename to "INITIALIZE_ATTACHMENTS"?
  store.on(types.CHANGE_UPLOAD_ATTACHMENT_FILE, (state, { id, data, isLoading, isError }) => {
    if (!id || !state.uploadAttachmentFiles.data[id]) {
      return { uploadAttachmentFiles: state.uploadAttachmentFiles }
    }

    return {
      uploadAttachmentFiles: {
        ...state.uploadAttachmentFiles,
        data: {
          ...state.uploadAttachmentFiles.data,
          [id]: { ...state.uploadAttachmentFiles.data[id], ...data, isLoading, isError },
        },
        attachments: [
          ...state.uploadAttachmentFiles.attachments,
          {
            filename: data.signedUrl,
            caption: '',
          }
        ],
        isLoading: false,
      },
    }
  })

  store.on(types.SET_ATTACHMENT_INFO, (state, { id, formData }) => {
    return {
      uploadAttachmentFiles: {
        ...state.uploadAttachmentFiles,
        formData: {
          ...state.uploadAttachmentFiles.formData,
          [id]: formData,
        },
      },
    }
  })

  store.on(types.UPLOAD_ATTACHMENT_FILES, async (state, { files }) => {
    if (!files || files.length === 0) {
      return
    }

    store.dispatch(types.INIT_UPLOAD_ATTACHMENT_FILES, { files })
    uploadFiles(files)
  })

  store.on(types.SUBMIT_ATTACHMENTS, async (state, { onFinish = noop }) => {
    store.dispatch(types.SUBMITTING_ATTACHMENTS)
    // TODO[MARCEL]: Submit attachments
  })
}
