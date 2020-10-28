import * as R from 'ramda'
import api from '@services/api'
import { STATUSES } from '@store/constants'
import * as types from '@constants/storeEventTypes'
import { authenticationService } from '@services'
import { track } from '@utilities/analytics'
import {
  createNewFolders,
  removeFolder,
  removeModelFromFolder,
  updateFolder,
  updateLike,
} from './updater'

const getInitAtom = () => ({
  isLoading: false,
  isLoaded: false,
  isError: false,
  isSaving: false,
  isSaved: false,
  saveError: false,
  data: [],
})
const noop = () => null
export default store => {
  store.on(types.STORE_INIT, () => ({
    folders: getInitAtom(),
  }))

  store.on(types.UPDATE_FOLDERS, (state, event) => ({
    folders: {
      ...state.folders,
      data: event,
    },
  }))

  store.on(types.LOADING_FOLDER, (state, _event) => ({
    folders: {
      ...state.folders,
      isLoading: true,
      isLoaded: false,
    },
  }))

  store.on(types.LOADED_FOLDER, (state, _event) => ({
    folders: {
      ...state.folders,
      isLoading: false,
      isLoaded: true,
    },
  }))

  store.on(types.ERROR_FOLDER, (state, _event) => ({
    folders: {
      ...state.folders,
      isError: true,
    },
  }))

  store.on(types.FETCH_FOLDERS, async _state => {
    store.dispatch(types.LOADING_FOLDER)
    await api({
      method: 'GET',
      endpoint: 'folders',
    })
      .then(res => {
        store.dispatch(types.LOADED_FOLDER)
        store.dispatch(types.UPDATE_FOLDERS, res.data)
      })
      .catch(_error => {
        store.dispatch(types.ERROR_FOLDER)
      })
  })

  store.on(types.SAVING_FOLDER, state => ({
    folders: {
      ...state.folders,
      isSaving: true,
      isSaved: false,
    },
  }))

  store.on(types.SAVED_FOLDER, state => ({
    folders: {
      ...state.folders,
      isSaving: false,
      isSaved: true,
    },
  }))

  store.on(types.ERROR_SAVING_FOLDER, state => ({
    folders: {
      ...state.folders,
      saveError: true,
      isSaving: false,
      isSaved: false,
    },
  }))

  store.on(
    types.CREATE_FOLDER,
    async (state, { data: newFolderData, onFinish, onError }) => {
      store.dispatch(types.SAVING_FOLDER)
      const { data, error } = await api({
        method: 'POST',
        endpoint: 'folders',
        body: newFolderData,
      })
      if (error) {
        store.dispatch(types.ERROR_SAVING_FOLDER)
        onError(error)
      } else {
        track('Folder Created')
        const newFolders = createNewFolders(
          { ...newFolderData, id: data.folderId, currentUser: state.currentUser.data },
          state.folders.data
        )
        store.dispatch(types.UPDATE_FOLDERS, newFolders)
        onFinish(data.folderId)
        store.dispatch(types.SAVED_FOLDER)
        store.dispatch(types.FETCH_THANGS, { silentUpdate: true })
      }
    }
  )

  store.on(
    types.DELETE_FOLDER,
    async (state, { folder, onFinish = noop, onError = noop }) => {
      store.dispatch(types.SAVING_FOLDER)
      const { id: folderId } = folder
      const { error } = await api({
        method: 'DELETE',
        endpoint: `folders/${folderId}`,
      })
      if (error) {
        store.dispatch(types.ERROR_FOLDER)
        onError(error)
      } else {
        track('Folder Deleted')
        const newFolders = removeFolder(folder, state.folders.data)
        store.dispatch(types.UPDATE_FOLDERS, newFolders)
        store.dispatch(types.SAVED_FOLDER)
        onFinish()
      }
    }
  )

  store.on(types.DELETE_MODEL_FROM_FOLDER, async (state, { model }) => {
    store.dispatch(types.SAVING_FOLDER)
    const newFolders = removeModelFromFolder(model, state.folders.data)
    store.dispatch(types.UPDATE_FOLDERS, newFolders)
    store.dispatch(types.SAVED_FOLDER)
  })

  store.on(
    types.FETCH_FOLDER,
    async (state, { folderId, inviteCode, onFinish = noop }) => {
      store.dispatch(types.LOADING_FOLDER)
      await api({
        method: 'GET',
        endpoint: `folders/${folderId}${inviteCode ? `?inviteCode=${inviteCode}` : ''}`,
      })
        .then(res => {
          const folder = res.data
          store.dispatch(types.LOADED_FOLDER)
          const newFolders = updateFolder(folder, state.folders.data)
          store.dispatch(types.UPDATE_FOLDERS, newFolders)
          store.dispatch(types.SAVED_FOLDER)
          onFinish()
        })
        .catch(_error => {
          store.dispatch(types.ERROR_FOLDER)
        })
    }
  )

  store.on(
    types.EDIT_FOLDER,
    async (
      _,
      { id: folderId, folder: updatedFolder, onError = noop, onFinish = noop }
    ) => {
      if (R.isNil(folderId)) return
      store.dispatch(types.SAVING_FOLDER)
      const userId = authenticationService.getCurrentUserId()
      const { error } = await api({
        method: 'PUT',
        endpoint: `folders/${folderId}`,
        body: {
          name: updatedFolder.name,
        },
      })

      if (error) {
        store.dispatch(types.ERROR_FOLDER)
        onError()
      } else {
        store.dispatch(types.FETCH_USER_LIKED_MODELS, { id: userId }) //Why do we need to fetch this?
        store.dispatch(types.FETCH_FOLDER, { folderId, onFinish })
      }
    }
  )

  store.on(
    types.INVITE_TO_FOLDER,
    async (state, { data, folderId, onFinish, onError }) => {
      store.dispatch(types.SAVING_FOLDER)
      const { error } = await api({
        method: 'POST',
        endpoint: `folders/${folderId}/members`,
        body: data,
      })
      if (error) {
        store.dispatch(types.ERROR_SAVING_FOLDER)
        onError(error)
      } else {
        track('Folder Invite Sent')
        store.dispatch(types.FETCH_FOLDER, { folderId, onFinish })
      }
    }
  )

  store.on(
    types.REVOKE_FOLDER_ACCESS,
    async (state, { folderId, userId, onError = noop, onFinish = noop }) => {
      store.dispatch(types.SAVING_FOLDER)
      const { error } = await api({
        method: 'DELETE',
        endpoint: `folders/${folderId}/members/${userId}`,
      })
      if (error) {
        store.dispatch(types.ERROR_SAVING_FOLDER)
        onError(error)
      } else {
        track('Folder Access Revoked')
        store.dispatch(types.FETCH_FOLDER, { folderId, onFinish })
      }
    }
  )

  store.on(types.LIKE_FOLDER, async (state, { id: folderId }) => {
    const id = authenticationService.getCurrentUserId()
    store.dispatch(types.SAVING_FOLDER)
    store.dispatch(types.CHANGE_USER_LIKED_MODELS_STATUS, {
      status: STATUSES.LOADING,
      atom: `user-liked-models-${id}`,
      data: R.pathOr({}, [`user-liked-models-${id}`, 'data'], state),
    })
    const { error } = await api({
      method: 'POST',
      endpoint: `folders/${folderId}/like`,
    })

    if (error) {
      store.dispatch(types.ERROR_SAVING_FOLDER)
    } else {
      track('Folder Liked', { folderId })
      const newLikes = updateLike(folderId, state, id, true)
      store.dispatch(types.CHANGE_USER_LIKED_MODELS_STATUS, {
        status: STATUSES.LOADED,
        atom: `user-liked-models-${id}`,
        data: newLikes,
      })
      store.dispatch(types.SAVED_FOLDER)
    }
  })

  store.on(types.UNLIKE_FOLDER, async (state, { id: folderId }) => {
    const id = authenticationService.getCurrentUserId()
    store.dispatch(types.SAVING_FOLDER)
    store.dispatch(types.CHANGE_USER_LIKED_MODELS_STATUS, {
      status: STATUSES.LOADING,
      atom: `user-liked-models-${id}`,
      data: R.pathOr({}, [`user-liked-models-${id}`, 'data'], state),
    })
    const { error } = await api({
      method: 'POST',
      endpoint: `folders/${folderId}/unlike`,
    })

    if (error) {
      store.dispatch(types.ERROR_SAVING_FOLDER)
    } else {
      track('Folder Unliked', { folderId })
      const newLikes = updateLike(folderId, state, id, false)
      store.dispatch(types.CHANGE_USER_LIKED_MODELS_STATUS, {
        status: STATUSES.LOADED,
        atom: `user-liked-models-${id}`,
        data: newLikes,
      })
      store.dispatch(types.SAVED_FOLDER)
    }
  })
}
