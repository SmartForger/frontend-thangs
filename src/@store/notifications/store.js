import api from '@services/api'
import { STATUSES, getStatusState } from '@store/constants'
import * as types from '@constants/storeEventTypes'

export default store => {
  store.on(types.STORE_INIT, () => ({
    notifications: getStatusState(STATUSES.INIT),
  }))

  store.on(
    types.CHANGE_NOTIFICATION_STATUS,
    (state, { status = STATUSES.INIT, data, error }) => ({
      notifications: {
        ...state.notifications,
        ...getStatusState(status),
        data,
        error,
      },
    })
  )

  store.on(types.FETCH_NOTIFICATIONS, async () => {
    store.dispatch(types.CHANGE_NOTIFICATION_STATUS, {
      status: STATUSES.LOADING,
    })
    const { data, error } = await api({ method: 'GET', endpoint: 'notifications' })
    if (error) {
      store.dispatch(types.CHANGE_NOTIFICATION_STATUS, {
        status: STATUSES.FAILURE,
        error: error,
      })
    } else {
      store.dispatch(types.CHANGE_NOTIFICATION_STATUS, {
        status: STATUSES.LOADED,
        data,
      })
    }
  })

  store.on(types.CLEAR_NOTIFICATIONS, async () => {
    store.dispatch(types.CHANGE_NOTIFICATION_STATUS, {
      status: STATUSES.LOADING,
    })
    const { error } = await api({ method: 'DELETE', endpoint: 'notifications/all' })
    if (error) {
      store.dispatch(types.CHANGE_NOTIFICATION_STATUS, {
        status: STATUSES.FAILURE,
        error: error,
      })
    } else {
      const { data, error } = await api({ method: 'GET', endpoint: 'notifications' })
      if (error) {
        store.dispatch(types.CHANGE_NOTIFICATION_STATUS, {
          status: STATUSES.FAILURE,
          error: error,
        })
      } else {
        store.dispatch(types.CHANGE_NOTIFICATION_STATUS, {
          status: STATUSES.LOADED,
          data,
        })
      }
    }
  })

  store.on(types.CLEAR_NOTIFICATION, async (_, { id }) => {
    store.dispatch(types.CHANGE_NOTIFICATION_STATUS, {
      status: STATUSES.LOADING,
    })
    const { error } = await api({ method: 'DELETE', endpoint: `notifications/${id}` })
    if (error) {
      store.dispatch(types.CHANGE_NOTIFICATION_STATUS, {
        status: STATUSES.FAILURE,
        error: error,
      })
    } else {
      const { data, error } = await api({ method: 'GET', endpoint: 'notifications' })
      if (error) {
        store.dispatch(types.CHANGE_NOTIFICATION_STATUS, {
          status: STATUSES.FAILURE,
          error: error,
        })
      } else {
        store.dispatch(types.CHANGE_NOTIFICATION_STATUS, {
          status: STATUSES.LOADED,
          data,
        })
      }
    }
  })

  store.on(types.READ_NOTIFICATIONS, async () => {
    store.dispatch(types.CHANGE_NOTIFICATION_STATUS, {
      status: STATUSES.LOADING,
    })
    const { error } = await api({ method: 'POST', endpoint: 'notifications/clear' })
    if (error) {
      store.dispatch(types.CHANGE_NOTIFICATION_STATUS, {
        status: STATUSES.FAILURE,
        error: error,
      })
    } else {
      const { data, error } = await api({ method: 'GET', endpoint: 'notifications' })
      if (error) {
        store.dispatch(types.CHANGE_NOTIFICATION_STATUS, {
          status: STATUSES.FAILURE,
          error: error,
        })
      } else {
        store.dispatch(types.CHANGE_NOTIFICATION_STATUS, {
          status: STATUSES.LOADED,
          data,
        })
      }
    }
  })
}
