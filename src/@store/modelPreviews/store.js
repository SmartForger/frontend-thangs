import api from '@services/api'
import * as types from '@constants/storeEventTypes'
import { STATUSES, getStatusState } from '@store/constants'
import { track } from '@utilities/analytics'
export const PREVIEW_MODELS_SIZE = 25

export default store => {
  store.on(types.STORE_INIT, () => ({
    modelPreviews: {
      ...getStatusState(STATUSES.INIT),
      data: [],
      pageToLoad: 1,
    },
  }))

  store.on(types.LOADING_MODEL_PREVIEW, (state, { isInitial }) => ({
    modelPreviews: {
      ...state.modelPreviews,
      ...getStatusState(STATUSES.LOADING),
      ...(isInitial && { data: [] }),
    },
  }))

  store.on(types.LOADED_MODEL_PREVIEW, (state, { data, isInitial }) => ({
    modelPreviews: {
      ...state.modelPreviews,
      ...getStatusState(STATUSES.LOADED),
      data: isInitial ? data : [...state.modelPreviews.data, ...data],
      pageToLoad: isInitial ? 1 : state.modelPreviews.pageToLoad + 1,
    },
  }))

  store.on(
    types.FETCH_MODEL_PREVIEW,
    async (state, { sortBy = 'likes', isInitial = false }) => {
      if (!state.modelPreviews.isLoading) {
        state.modelPreviews.isLoading = true
        store.dispatch(types.LOADING_MODEL_PREVIEW, { isInitial })
        if (!isInitial)
          track('Load More', { page: state.modelPreviews.pageToLoad, sortBy })
        const { data } = await api({
          method: 'GET',
          endpoint: 'models/landing',
          params: {
            sortBy,
            sortDir: 'desc',
            page: isInitial ? 0 : state.modelPreviews.pageToLoad,
            pageSize: PREVIEW_MODELS_SIZE,
          },
        })
        store.dispatch(types.LOADED_MODEL_PREVIEW, { data, isInitial })
      }
    }
  )
}
