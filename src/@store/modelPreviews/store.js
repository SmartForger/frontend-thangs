import api from '@services/api'
import * as types from '@constants/storeEventTypes'

const getInitAtom = () => ({
  isLoaded: false,
  isLoading: false,
  isError: false,
  data: {},
})

export default store => {
  store.on(types.STORE_INIT, () => ({
    modelPreviews: getInitAtom(),
  }))

  store.on('loading-model-previews', state => ({
    modelPreviews: {
      ...state.models,
      isLoading: true,
      isLoaded: false,
    },
  }))

  store.on('loaded-model-previews', (state, { data }) => ({
    modelPreviews: {
      ...state.models,
      isLoading: false,
      isLoaded: true,
      data,
    },
  }))

  store.on('fetch-model-previews', async () => {
    store.dispatch('loading-model-previews')
    const { data } = await api({ method: 'GET', endpoint: 'models/landing' })
    store.dispatch('loaded-model-previews', { data })
  })
}
