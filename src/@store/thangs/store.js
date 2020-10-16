import api from '@services/api'
import * as types from '@constants/storeEventTypes'
import { authenticationService } from '@services'

const getInitAtom = () => ({
  isLoading: false,
  isLoaded: false,
  isError: false,
  data: {},
})

const noop = () => null

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

  store.on(
    types.FETCH_THANGS,
    async (_state, { onFinish = noop, onFinishData = null, silentUpdate = false }) => {
      const currentUserId = authenticationService.getCurrentUserId()
      if (!currentUserId) return
      if (!silentUpdate) {
        store.dispatch(types.LOADING_THANGS)
      }
      const { data, error } = await api({
        method: 'GET',
        endpoint: `users/${currentUserId}/thangs`,
      })

      if (error) {
        store.dispatch(types.ERROR_THANGS)
      } else {
        store.dispatch(types.LOADED_THANGS)
        store.dispatch(types.UPDATE_THANGS, data)
        onFinish(onFinishData)
      }
    }
  )
}
