import api from '@services/api'
import * as types from '@constants/storeEventTypes'
import { STATUSES, getStatusState } from '@store/constants'
import { track } from '@utilities/analytics'
export const PREVIEW_MODELS_SIZE = 24
const noop = () => null

export default store => {
  store.on(types.STORE_INIT, () => ({
    modelPreviews: {
      ...getStatusState(STATUSES.INIT),
      data: [],
      pageToLoad: 0,
    },
  }))

  store.on(types.LOADING_MODEL_PREVIEW, (state, { isInitial }) => ({
    modelPreviews: {
      ...state.modelPreviews,
      ...getStatusState(STATUSES.LOADING),
      ...(isInitial && { data: [], pageToLoad: 1 }),
    },
  }))

  store.on(types.LOADED_MODEL_PREVIEW, (state, { data, isInitial }) => ({
    modelPreviews: {
      ...state.modelPreviews,
      ...getStatusState(STATUSES.LOADED),
      data: isInitial ? data : [...state.modelPreviews.data, ...data],
      pageToLoad: isInitial
        ? 1
        : state.modelPreviews.pageToLoad + Math.floor(data.length / PREVIEW_MODELS_SIZE),
    },
  }))

  store.on(
    types.FETCH_MODEL_PREVIEW,
    async (
      state,
      { isInitial = false, onFinish = noop, pageCount = 1, sortBy = 'likes' }
    ) => {
      if (!state.modelPreviews.isLoading) {
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
            pageSize: PREVIEW_MODELS_SIZE * pageCount,
          },
        })
        store.dispatch(types.LOADED_MODEL_PREVIEW, { data, isInitial })
        onFinish(data)
      }
    }
  )
}
