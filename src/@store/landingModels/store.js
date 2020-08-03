import api from '@services/api'

const getInitAtom = () => ({
  isLoaded: false,
  isLoading: false,
  isError: false,
  data: {},
})

export default store => {
  store.on('@init', () => ({
    landingModels: getInitAtom(),
  }))

  store.on('loading-models', state => ({
    landingModels: {
      ...state.models,
      isLoading: true,
      isLoaded: false,
    },
  }))

  store.on('loaded-models', (state, { data }) => ({
    landingModels: {
      ...state.models,
      isLoading: false,
      isLoaded: true,
      data,
    },
  }))

  store.on('landing-models/fetch-models', async () => {
    store.dispatch('loading-models')
    const { data } = await api({ method: 'GET', endpoint: 'models/landing' })
    store.dispatch('loaded-models', { data })
  })
}
