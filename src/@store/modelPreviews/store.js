import * as R from 'ramda'
import api from '@services/api'
import * as types from '@constants/storeEventTypes'
import { STATUSES, getStatusState } from '@store/constants'
import { track } from '@utilities/analytics'
import { authenticationService } from '@services'
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

  store.on(types.CHANGE_LIKE_MODEL_PREVIEW, (state, { id }) => {
    const currentUserId = parseInt(authenticationService.getCurrentUserId())

    const data = R.path(['modelPreviews', 'data'], state) || []
    const model = data.find(model => model.id === id) || {}
    const likes = model.likes || []
    const userLikeIdx = likes.indexOf(currentUserId)

    if (userLikeIdx > -1) {
      likes.splice(userLikeIdx, 1)
      store.dispatch(types.UNLIKE_MODEL, { model })
    } else {
      likes.push(currentUserId)
      store.dispatch(types.LIKE_MODEL, { model })
    }

    return {
      modelPreviews: {
        ...state.modelPreviews,
        data: [...data],
      },
    }
  })
}
