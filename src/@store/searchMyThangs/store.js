import api from '@services/api'
import * as types from '@constants/storeEventTypes'

const getInitAtom = () => ({
  isLoading: false,
  isLoaded: false,
  isError: false,
  data: {},
})

const noop = () => null

export default store => {
  store.on(types.STORE_INIT, () => ({
    searchThangs: getInitAtom(),
  }))

  store.on(types.UPDATE_SEARCH_MY_THANGS, (state, event) => ({
    searchThangs: {
      data: event,
    },
  }))

  store.on(types.ERROR_SEARCH_MY_THANGS, (state, _event) => ({
    searchThangs: {
      ...state.searchThangs,
      isError: true,
    },
  }))

  store.on(types.LOADING_SEARCH_MY_THANGS, (state, _event) => ({
    searchThangs: {
      ...state.searchThangs,
      isLoading: true,
      isLoaded: false,
    },
  }))

  store.on(types.LOADED_SEARCH_MY_THANGS, (state, _event) => ({
    searchThangs: {
      ...state.searchThangs,
      isLoading: false,
      isLoaded: true,
    },
  }))

  store.on(types.SEARCH_MY_THANGS, async (_state, { searchTerm, onFinish = noop }) => {
    if (!searchTerm) return
    store.dispatch(types.LOADING_SEARCH_MY_THANGS)
    const { data, error } = await api({
      method: 'GET',
      endpoint: `users/search-my-thangs?searchTerm=${searchTerm}`,
    })

    if (error) {
      store.dispatch(types.ERROR_SEARCH_MY_THANGS)
    } else {
      store.dispatch(types.LOADED_SEARCH_MY_THANGS)
      store.dispatch(types.UPDATE_SEARCH_MY_THANGS, data)
      onFinish()
    }
  })
}
