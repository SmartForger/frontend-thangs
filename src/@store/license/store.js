import * as types from '../../@constants/storeEventTypes'
import api from '../../@services/api'

const getInitAtom = () => ({
  isLoaded: false,
  isLoading: false,
  isError: false,
  data: {},
})

export default store => {
  store.on(types.STORE_INIT, () => ({
    license: getInitAtom(),
  }))

  store.on(types.LOADING_MODEL_LICENSE, state => ({
    license: {
      ...state.license,
      isLoading: true,
      isLoaded: false,
    },
  }))

  store.on(types.LOADED_MODEL_LICENSE, (state, { data }) => ({
    license: {
      ...state.license,
      isLoading: false,
      isLoaded: true,
      data,
    },
  }))

  store.on(types.FAILED_MODEL_LICENSE, state => ({
    license: {
      ...state.license,
      isLoading: false,
      isLoaded: true,
      isError: true,
    },
  }))
  store.on(types.FETCH_MODEL_LICENSE, async (state, { modelId, _onFinish }) => {
    store.dispatch(types.LOADING_MODEL_LICENSE)
    const { data, error } = await api({
      method: 'GET',
      endpoint: `models/${modelId}/license`,
    })

    if (error) {
      store.dispatch(types.FAILED_MODEL_LICENSE)
    } else {
      store.dispatch(types.LOADED_MODEL_LICENSE, {
        data,
      })
    }
  })
}
