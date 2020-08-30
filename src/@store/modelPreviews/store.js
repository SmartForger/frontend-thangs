import api from '@services/api'
import * as types from '@constants/storeEventTypes'

const getInitAtom = () => ({
  isLoaded: false,
  isLoading: false,
  isError: false,
  data: {},
})

export default store => {
  store.on(types.STORE_INIT, () => ({
    modelPreviews: getInitAtom(),
  }))

  store.on(types.LOADING_MODEL_PREVIEW, state => ({
    modelPreviews: {
      ...state.models,
      isLoading: true,
      isLoaded: false,
    },
  }))

  store.on(types.LOADED_MODEL_PREVIEW, (state, { data }) => ({
    modelPreviews: {
      ...state.models,
      isLoading: false,
      isLoaded: true,
      data,
    },
  }))

  store.on(types.FETCH_MODEL_PREVIEW, async () => {
    store.dispatch(types.LOADING_MODEL_PREVIEW)
    const { data } = await api({ method: 'GET', endpoint: 'models/landing' })
    store.dispatch(types.LOADED_MODEL_PREVIEW, { data })
  })
}
