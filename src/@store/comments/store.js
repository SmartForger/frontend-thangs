import api from '@services/api'
import { STATUSES, getStatusState } from '@store/constants'

const COLLECTION_PREFIX = 'model-comments'

export default store => {
  store.on('@init', () => ({}))

  store.on(`init-${COLLECTION_PREFIX}`, (_, { id }) => ({
    [`${COLLECTION_PREFIX}-${id}`]: {
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
  store.on(`fetch-${COLLECTION_PREFIX}`, async (_, { id }) => {
    store.dispatch('change-status', {
      status: STATUSES.LOADING,
      atom: `${COLLECTION_PREFIX}-${id}`,
    })
    const { data, error } = await api({
      method: 'GET',
      endpoint: `models/${id}/comments`,
    })

    if (error) {
      store.dispatch('change-status', {
        status: STATUSES.FAILURE,
        atom: `${COLLECTION_PREFIX}-${id}`,
      })
    } else {
      store.dispatch('change-status', {
        status: STATUSES.LOADED,
        atom: `${COLLECTION_PREFIX}-${id}`,
        data,
      })
    }
  })
}
