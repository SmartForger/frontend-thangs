import api from '@services/api'
import * as types from '@constants/storeEventTypes'
import { track } from '@utilities'

const noop = () => null

const getInitAtom = () => ({
  isLoaded: false,
  isLoading: false,
  isError: false,
  data: [],
})

export default store => {
  store.on(types.STORE_INIT, () => ({
    modelAttachments: getInitAtom(),
  }))

  store.on(types.LOADING_MODEL_ATTACHMENTS, state => ({
    modelAttachments: {
      ...state.modelAttachments,
      isLoading: true,
      isLoaded: false,
    },
  }))

  store.on(types.LOADED_MODEL_ATTACHMENTS, (state, { data }) => ({
    modelAttachments: {
      ...state.modelAttachments,
      isLoading: false,
      isLoaded: true,
      data,
    },
  }))

  store.on(types.FAILED_MODEL_ATTACHMENTS, state => ({
    modelAttachments: {
      ...state.modelAttachments,
      isLoading: false,
      isLoaded: true,
      isError: true,
    },
  }))

  store.on(types.FETCH_MODEL_ATTACHMENTS, async (_, { modelId, onFinish = noop }) => {
    store.dispatch(types.LOADING_MODEL_ATTACHMENTS)
    const { data, error } = await api({
      method: 'GET',
      endpoint: `models/${modelId}/attachments`,
    })

    if (error) {
      store.dispatch(types.FAILED_MODEL_ATTACHMENTS)
    } else {
      onFinish(data)
      store.dispatch(types.LOADED_MODEL_ATTACHMENTS, { data })
    }
  })

  store.on(
    types.DELETE_MODEL_ATTACHMENT,
    async (_state, { attachmentId, modelId, onFinish = noop }) => {
      const { error } = await api({
        method: 'DELETE',
        endpoint: `attachments/${attachmentId}`,
      })

      if (!error) {
        store.dispatch(types.FETCH_MODEL_ATTACHMENTS, { modelId, onFinish })
        track('Model Attachment Deleted', { modelId, attachmentId })
      }
    }
  )
}
