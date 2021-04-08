import api from '@services/api'
import * as types from '@constants/storeEventTypes'

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

  store.on(types.FETCH_MODEL_ATTACHMENTS, async (_, { modelId }) => {
    store.dispatch(types.LOADING_MODEL_ATTACHMENTS)
    const { data, error } = await api({
      method: 'GET',
      endpoint: `models/${modelId}/attachments`,
    })

    if (error) {
      store.dispatch(types.FAILED_MODEL_ATTACHMENTS)
    } else {
      store.dispatch(types.LOADED_MODEL_ATTACHMENTS, { data })
    }
  })
}
