import api from '@services/api'
import { STATUSES, getStatusState } from '@store/constants'
import * as types from '@constants/storeEventTypes'
import { track } from '@utilities/analytics'

export default store => {
  store.on(types.STORE_INIT, _ => ({
    'like-folder': {
      ...getStatusState(STATUSES.INIT),
      data: {},
    },
  }))
  store.on(
    types.CHANGE_LIKE_FOLDER_STATUS,
    (state, { atom, status = STATUSES.INIT, data }) => ({
      [atom]: {
        ...state[atom],
        ...getStatusState(status),
        data,
      },
    })
  )
  store.on(types.LIKE_FOLDER, async (_, { id: folderId }) => {
    store.dispatch(types.CHANGE_LIKE_FOLDER_STATUS, {
      status: STATUSES.LOADING,
      atom: 'like-folder',
    })
    const { data, error } = await api({
      method: 'POST',
      endpoint: `folders/${folderId}/like`,
    })

    if (error) {
      store.dispatch(types.CHANGE_LIKE_FOLDER_STATUS, {
        status: STATUSES.FAILURE,
        atom: `like-folder-${folderId}`,
      })
    } else {
      store.dispatch(types.CHANGE_LIKE_FOLDER_STATUS, {
        status: STATUSES.LOADED,
        atom: 'like-folder',
        data,
      })
      track('Folder Liked', { folderId })
    }
  })

  store.on(types.UNLIKE_FOLDER, async (_, { id: folderId }) => {
    store.dispatch(types.CHANGE_LIKE_FOLDER_STATUS, {
      status: STATUSES.LOADING,
      atom: 'like-folder',
    })
    const { data, error } = await api({
      method: 'POST',
      endpoint: `folders/${folderId}/unlike`,
    })

    if (error) {
      store.dispatch(types.CHANGE_LIKE_FOLDER_STATUS, {
        status: STATUSES.FAILURE,
        atom: 'like-folder',
      })
    } else {
      store.dispatch(types.CHANGE_LIKE_FOLDER_STATUS, {
        status: STATUSES.LOADED,
        atom: 'like-folder',
        data,
      })
      track('Folder Unliked', { folderId })
    }
  })
}
