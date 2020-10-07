import api from '@services/api'
import * as types from '@constants/storeEventTypes'

const getInitAtom = () => ({
  isLoading: false,
  isLoaded: false,
  isError: false,
  data: {},
})

export default store => {
  store.on(types.STORE_INIT, () => ({
    thangs: getInitAtom(),
  }))

  store.on(types.UPDATE_THANGS, (state, event) => ({
    thangs: {
      ...state.thangs,
      data: event,
    },
  }))

  store.on(types.ERROR_THANGS, (state, _event) => ({
    thangs: {
      ...state.thangs,
      isError: true,
    },
  }))

  store.on(types.LOADING_THANGS, (state, _event) => ({
    thangs: {
      ...state.thangs,
      isLoading: true,
      isLoaded: false,
    },
  }))

  store.on(types.LOADED_THANGS, (state, _event) => ({
    thangs: {
      ...state.thangs,
      isLoading: false,
      isLoaded: true,
    },
  }))

  store.on(types.FETCH_THANGS, async (_state, { id }) => {
    store.dispatch(types.LOADING_THANGS)
    await api({
      method: 'GET',
      endpoint: `users/${id}/thangs`,
    })
      .then(res => {
        store.dispatch(types.LOADED_THANGS)
        store.dispatch(types.UPDATE_THANGS, res.data)
      })
      .catch(_error => {
        store.dispatch(types.ERROR_THANGS)
      })
  })
}
