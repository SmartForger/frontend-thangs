import api from '@services/api'
import { STATUSES, getStatusState } from '@store/constants'

const COLLECTION_PREFIX = 'like-model'

export default store => {
  store.on('init', (_) => ({
    [`${COLLECTION_PREFIX}`]: {
      ...getStatusState(STATUSES.INIT),
      data: {},
    },
  }))
  store.on('change-status', (state, { atom, status = STATUSES.INIT, data }) => ({
    [atom]: {
      ...state[atom],
      ...getStatusState(status),
      data,
    },
  }))
  store.on(`post-${COLLECTION_PREFIX}`, async (_, { modelId, currentUserId }) => {
    store.dispatch('change-status', {
      status: STATUSES.LOADING,
      atom: `${COLLECTION_PREFIX}`,
    })
    const { data, error } = await api({
      method: 'POST',
      endpoint: `models/${modelId}/like`,
    })

    if (error) {
      store.dispatch('change-status', {
        status: STATUSES.FAILURE,
        atom: `${COLLECTION_PREFIX}-${modelId}`,
      })
    } else {
      store.dispatch('change-status', {
        status: STATUSES.LOADED,
        atom: `${COLLECTION_PREFIX}`,
        data,
      })
      store.dispatch('update-model-likes', {modelId: modelId, currentUserId: currentUserId})
    }
  })

  store.on(`delete-${COLLECTION_PREFIX}`, async (_, { modelId, currentUserId }) => {
    store.dispatch('change-status', {
      status: STATUSES.LOADING,
      atom: `${COLLECTION_PREFIX}`,
    })
    const { data, error } = await api({
      method: 'POST',
      endpoint: `models/${modelId}/unlike`,
    })

    if (error) {
      store.dispatch('change-status', {
        status: STATUSES.FAILURE,
        atom: `${COLLECTION_PREFIX}`,
      })
    } else {
      store.dispatch('change-status', {
        status: STATUSES.LOADED,
        atom: `${COLLECTION_PREFIX}`,
        data,
      })
      store.dispatch('update-model-likes', {modelId: modelId, currentUserId: currentUserId})
    }
  })
}
