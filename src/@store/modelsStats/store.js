import * as types from '../../@constants/storeEventTypes'
import api from '../../@services/api'

const getInitAtom = () => ({
  isLoaded: false,
  isLoading: false,
  isError: false,
  data: {},
})

export default store => {
  store.on(types.INIT_MODELS_STATS, () => ({
    modelsStats: getInitAtom(),
  }))

  store.on(types.LOADING_MODELS_STATS, state => ({
    modelsStats: {
      ...state.modelsStats,
      isLoading: true,
      isLoaded: false,
    },
  }))

  store.on(types.LOADED_MODELS_STATS, (state, { data }) => ({
    modelsStats: {
      ...state.modelsStats,
      isLoading: false,
      isLoaded: true,
      data,
    },
  }))

  store.on(types.FAILED_MODELS_STATS, state => ({
    modelsStats: {
      ...state.modelsStats,
      isLoading: false,
      isLoaded: true,
      isError: true,
    },
  }))
  store.on(types.FETCH_MODELS_STATS, async () => {
    store.dispatch(types.LOADING_MODELS_STATS)
    const { data, error } = await api({
      method: 'GET',
      endpoint: 'models/stats',
    })

    if (error) {
      store.dispatch(types.FAILED_MODELS_STATS)
    } else {
      store.dispatch(types.LOADED_MODELS_STATS, {
        data,
      })
    }
  })
}
