import api from '@services/api'
import * as types from '@constants/storeEventTypes'
import { STATUSES, getStatusState } from '@store/constants'

export const PREVIEW_MODELS_SIZE = 20

export default store => {
  store.on(types.STORE_INIT, () => ({
    modelPreviews: {
      ...getStatusState(STATUSES.INIT),
      data: [],
      pageToLoad: 1,
    }
  }))

  store.on(types.LOADING_MODEL_PREVIEW, state => ({
    modelPreviews: {
      ...state.modelPreviews,
      ...getStatusState(STATUSES.LOADING),
    },
  }))

  store.on(types.LOADED_MODEL_PREVIEW, (state, { data }) => ({
    modelPreviews: {
      ...state.modelPreviews,
      ...getStatusState(STATUSES.LOADED),
      data: [...state.modelPreviews.data, ...data ],
      pageToLoad: state.modelPreviews.pageToLoad + 1
    },
  }))

  store.on(types.FETCH_MODEL_PREVIEW, async (state, { sortBy = 'likes' }) => {
    store.dispatch(types.LOADING_MODEL_PREVIEW)
    const { data } = await api({
      method: 'GET',
      endpoint: 'models/landing',
      params: {
        sortBy,
        sortDir: 'desc',
        page: state.modelPreviews.pageToLoad,
        pageSize: PREVIEW_MODELS_SIZE,
      }
    })
    store.dispatch(types.LOADED_MODEL_PREVIEW, { data })
  })
}
