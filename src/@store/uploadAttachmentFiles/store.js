import * as types from '@constants/storeEventTypes'
import { api, uploadAttachmentFiles } from '@services'

const getInitAtom = () => ({
  isLoading: false,
  isError: false,
  isSubmitted: false,
  data: {},
  attachments: {},
})

export default store => {
  store.on(types.STORE_INIT, () => ({
    uploadAttachmentFiles: getInitAtom(),
  }))

  store.on(types.RESET_UPLOAD_ATTACHMENT_FILES, () => ({
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

  store.on(types.SUBMIT_ATTACHMENTS_SUCCEEDED, state => {
    return {
      uploadAttachmentFiles: {
        ...state.uploadAttachmentFiles,
        isLoading: false,
        isError: false,
        isSubmitted: true,
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

    const attachments = files.reduce(
      (attachments, file, curIndex) => ({
        ...attachments,
        [file.id]: {
          id: file.id,
          position: curIndex,
          file: file.file,
          filename: '',
          caption: '',
        },
      }),
      {}
    )

    return {
      uploadAttachmentFiles: {
        ...state.uploadAttachmentFiles,
        attachments,
        data: {
          ...state.uploadAttachmentFiles.data,
          ...newFilesMap,
        },
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
  })

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
        attachments: {
          ...state.uploadAttachmentFiles.attachments,
          [id]: {
            ...state.uploadAttachmentFiles.attachments[id],
            filename: data.newFileName,
          },
        },
        isLoading: false,
      },
    }
  })

  store.on(types.SET_ATTACHMENT_INFO, (state, { id, updatedAttachmentData }) => {
    return {
      uploadAttachmentFiles: {
        ...state.uploadAttachmentFiles,
        attachments: {
          ...state.uploadAttachmentFiles.attachments,
          [id]: {
            ...state.uploadAttachmentFiles.attachments[id],
            ...updatedAttachmentData,
          },
        },
      },
    }
  })

  store.on(types.UPLOAD_ATTACHMENT_FILES, async (state, { files }) => {
    if (!files || files.length === 0) {
      return
    }

    store.dispatch(types.INIT_UPLOAD_ATTACHMENT_FILES, { files })
    uploadAttachmentFiles(files)
  })

  store.on(types.SUBMIT_ATTACHMENTS, async (state, { modelId }) => {
    try {
      store.dispatch(types.SUBMITTING_ATTACHMENTS)
      const attachments = Object.values(state.uploadAttachmentFiles.attachments)
      const getRequests = () => attachments.map(async ({ filename, caption }) => await api({
        method: 'POST',
        endpoint: `models/${modelId}/attachment`,
        body: {
          filename,
          caption,
        },
      })
      )
      const results = await Promise.all(getRequests())
        .then((res) => {
          store.dispatch(types.SUBMIT_ATTACHMENTS_SUCCEEDED)
          store.dispatch(types.FETCH_MODEL_ATTACHMENTS, { modelId })
          return res
        })
        .catch(() => store.dispatch(types.SUBMIT_ATTACHMENTS_FAILED))
      if (results.some(res => res.error)) throw new Error('Unable to submit attachment')
    } catch (error) {
      store.dispatch(types.SUBMIT_ATTACHMENTS_FAILED)
    }
  })
}
