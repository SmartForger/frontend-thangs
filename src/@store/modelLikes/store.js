import api from '@services/api'
import { STATUSES, getStatusState } from '@store/constants'

export default store => {
  store.on('init', _ => ({
    'like-model': {
      ...getStatusState(STATUSES.INIT),
      data: {},
    },
  }))
  store.on(
    'change-like-model-status',
    (state, { atom, status = STATUSES.INIT, data }) => ({
      [atom]: {
        ...state[atom],
        ...getStatusState(status),
        data,
      },
    })
  )
  store.on('post-like-model', async (_, { modelId, currentUserId }) => {
    store.dispatch('change-like-model-status', {
      status: STATUSES.LOADING,
      atom: 'like-model',
    })
    const { data, error } = await api({
      method: 'POST',
      endpoint: `models/${modelId}/like`,
    })

    if (error) {
      store.dispatch('change-like-model-status', {
        status: STATUSES.FAILURE,
        atom: `like-model-${modelId}`,
      })
    } else {
      store.dispatch('change-like-model-status', {
        status: STATUSES.LOADED,
        atom: 'like-model',
        data,
      })
      store.dispatch('update-model-likes', {
        modelId: modelId,
        currentUserId: currentUserId,
      })
    }
  })

  store.on('delete-like-model', async (_, { modelId, currentUserId }) => {
    store.dispatch('change-like-model-status', {
      status: STATUSES.LOADING,
      atom: 'like-model',
    })
    const { data, error } = await api({
      method: 'POST',
      endpoint: `models/${modelId}/unlike`,
    })

    if (error) {
      store.dispatch('change-like-model-status', {
        status: STATUSES.FAILURE,
        atom: 'like-model',
      })
    } else {
      store.dispatch('change-like-model-status', {
        status: STATUSES.LOADED,
        atom: 'like-model',
        data,
      })
      store.dispatch('update-model-likes', {
        modelId: modelId,
        currentUserId: currentUserId,
      })
    }
  })
}
