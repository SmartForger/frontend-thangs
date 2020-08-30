import api from '@services/api'
import { STATUSES, getStatusState } from '@store/constants'
import * as types from '@constants/storeEventTypes'

export default store => {
  store.on(types.STORE_INIT, () => ({
    notifications: getStatusState(STATUSES.INIT),
  }))

  store.on(
    'change-notification-status',
    (state, { status = STATUSES.INIT, data, error }) => ({
      notifications: {
        ...state.notifications,
        ...getStatusState(status),
        data,
        error,
      },
    })
  )

  store.on('fetch-notifications', async () => {
    store.dispatch('change-notification-status', {
      status: STATUSES.LOADING,
    })
    const { data, error } = await api({ method: 'GET', endpoint: 'notifications' })
    if (error) {
      store.dispatch('change-notification-status', {
        status: STATUSES.FAILURE,
        error: error,
      })
    } else {
      store.dispatch('change-notification-status', {
        status: STATUSES.LOADED,
        data,
      })
    }
  })

  store.on('clear-notifications', async () => {
    store.dispatch('change-notification-status', {
      status: STATUSES.LOADING,
    })
    const { error } = await api({ method: 'DELETE', endpoint: 'notifications/all' })
    if (error) {
      store.dispatch('change-notification-status', {
        status: STATUSES.FAILURE,
        error: error,
      })
    } else {
      const { data, error } = await api({ method: 'GET', endpoint: 'notifications' })
      if (error) {
        store.dispatch('change-notification-status', {
          status: STATUSES.FAILURE,
          error: error,
        })
      } else {
        store.dispatch('change-notification-status', {
          status: STATUSES.LOADED,
          data,
        })
      }
    }
  })

  store.on('clear-notification', async (_, { id }) => {
    store.dispatch('change-notification-status', {
      status: STATUSES.LOADING,
    })
    const { error } = await api({ method: 'DELETE', endpoint: `notifications/${id}` })
    if (error) {
      store.dispatch('change-notification-status', {
        status: STATUSES.FAILURE,
        error: error,
      })
    } else {
      const { data, error } = await api({ method: 'GET', endpoint: 'notifications' })
      if (error) {
        store.dispatch('change-notification-status', {
          status: STATUSES.FAILURE,
          error: error,
        })
      } else {
        store.dispatch('change-notification-status', {
          status: STATUSES.LOADED,
          data,
        })
      }
    }
  })

  store.on('read-notifications', async () => {
    store.dispatch('change-notification-status', {
      status: STATUSES.LOADING,
    })
    const { error } = await api({ method: 'POST', endpoint: 'notifications/clear' })
    if (error) {
      store.dispatch('change-notification-status', {
        status: STATUSES.FAILURE,
        error: error,
      })
    } else {
      const { data, error } = await api({ method: 'GET', endpoint: 'notifications' })
      if (error) {
        store.dispatch('change-notification-status', {
          status: STATUSES.FAILURE,
          error: error,
        })
      } else {
        store.dispatch('change-notification-status', {
          status: STATUSES.LOADED,
          data,
        })
      }
    }
  })
}
