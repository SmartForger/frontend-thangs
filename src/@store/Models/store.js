import api from '@services/api'

const getInitAtom = () => ({
  isLoaded: false,
  isLoading: false,
  isError: false,
  data: {},
})

export default store => {
  store.on('@init', () => ({}))

  store.on('init-model', (_, { id }) => ({
    [`model-${id}`]: getInitAtom(),
  }))
  store.on('update-model', (state, { id, data }) => ({
    [`model-${id}`]: {
      ...state[`model-${id}`],
      data,
    },
  }))
  store.on('loading-model', (state, { id }) => ({
    [`model-${id}`]: {
      ...state[`model-${id}`],
      isLoading: true,
      isLoaded: false,
    },
  }))
  store.on('loaded-model', (state, { id, data }) => ({
    [`model-${id}`]: {
      ...state[`model-${id}`],
      isLoading: false,
      isLoaded: true,
      data,
    },
  }))
  store.on('fetch-model', async (state, { id }) => {
    store.dispatch('loading-model', { id })
    const { data } = await api({ method: 'GET', endpoint: `models/${id}` })
    store.dispatch('loaded-model', { id, data: data.model })
  })
}
