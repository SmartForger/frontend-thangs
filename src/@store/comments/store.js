import api from '@services/api'

const getInitAtom = () => ({
  isLoaded: false,
  isLoading: false,
  isError: false,
  data: {},
})

const COLLECTION_PREFIX = 'model-comments'

export default store => {
  store.on('@init', () => ({}))

  store.on(`init-${COLLECTION_PREFIX}`, (_, { id }) => {
    return {
      [`${COLLECTION_PREFIX}-${id}`]: getInitAtom(),
    }
  })
  store.on(`update-${COLLECTION_PREFIX}`, (state, { id, data }) => ({
    [`${COLLECTION_PREFIX}-${id}`]: {
      ...state[`${COLLECTION_PREFIX}-${id}`],
      data,
    },
  }))
  store.on(`loading-${COLLECTION_PREFIX}`, (state, { id }) => ({
    [`${COLLECTION_PREFIX}-${id}`]: {
      ...state[`${COLLECTION_PREFIX}-${id}`],
      isLoading: true,
      isLoaded: false,
    },
  }))
  store.on(`failure-${COLLECTION_PREFIX}`, (state, { id }) => ({
    [`${COLLECTION_PREFIX}-${id}`]: {
      ...state[`${COLLECTION_PREFIX}-${id}`],
      isLoading: false,
      isLoaded: true,
      isError: true,
    },
  }))
  store.on(`loaded-${COLLECTION_PREFIX}`, (state, { id, data }) => ({
    [`${COLLECTION_PREFIX}-${id}`]: {
      ...state[`${COLLECTION_PREFIX}-${id}`],
      isLoading: false,
      isLoaded: true,
      data,
    },
  }))
  store.on(`fetch-${COLLECTION_PREFIX}`, async (_, { id }) => {
    store.dispatch(`loading-${COLLECTION_PREFIX}`, { id })
    const { data, error } = await api({ method: 'GET', endpoint: `models/${id}/comments` })

    if (error) {
      store.dispatch(`failure-${COLLECTION_PREFIX}`, { id })
    } else {
      store.dispatch(`loaded-${COLLECTION_PREFIX}`, { id, data })
    }
  })
}
