import * as R from 'ramda'
import api from '@services/api'
import * as types from '@constants/storeEventTypes'
import { track } from '@utilities/analytics'

const getInitAtom = () => ({
  isLoading: false,
  isLoaded: false,
  isError: false,
  isSaving: false,
  isSaved: false,
  saveError: false,
  currentFolder: null,
  createdFolder: null,
  data: {},
})
const noop = () => null
export default store => {
  store.on(types.STORE_INIT, () => ({
    folders: getInitAtom(),
  }))

  store.on(
    types.EDIT_FOLDER,
    async (
      _,
      { id: folderId, folder: updatedFolder, onError = noop, onFinish = noop }
    ) => {
      if (R.isNil(folderId)) return
      store.dispatch(types.LOADING_FOLDER)
      const { error } = await api({
        method: 'PUT',
        endpoint: `folders/${folderId}`,
        body: {
          folderName: updatedFolder.name,
        },
      })

      if (error) {
        store.dispatch(types.ERROR_FOLDER)
        onError()
      } else {
        store.dispatch(types.FETCH_FOLDERS)
        store.dispatch(types.FETCH_THANGS, { onFinish })
        onFinish()
      }
    }
  )

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
          store.dispatch(types.UPDATE_FOLDER, { folderId, folder })
          onFinish()
        })
        .catch(_error => {
          store.dispatch(types.ERROR_FOLDER)
        })
    }
  )

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

  store.on(types.SAVED_FOLDER_DATA, (state, folder) => ({
    folders: {
      ...state.folders,
      createdFolder: folder,
    },
  }))

  store.on(types.CREATE_FOLDER, (state, { data, onFinish, onError }) => {
    store.dispatch(types.SAVING_FOLDER)
    api({
      method: 'POST',
      endpoint: 'folders',
      body: data,
    })
      .then(res => {
        if (res.status === 201) {
          store.dispatch(types.SAVED_FOLDER_DATA, res.data)
          track('Folder Created')
          onFinish(res.data)
          store.dispatch(types.SAVED_FOLDER)
          store.dispatch(types.FETCH_FOLDERS)
        }
      })
      .catch(error => {
        store.dispatch(types.ERROR_SAVING_FOLDER)
        onError(error)
      })
  })

  store.on(types.DELETE_FOLDER, async (_state, { id: folderId, onFinish }) => {
    store.dispatch(types.LOADING_FOLDER)
    await api({
      method: 'DELETE',
      endpoint: `folders/${folderId}`,
    })
      .then(_res => {
        store.dispatch(types.LOADED_FOLDER)
        track('Folder Deleted')
        onFinish()
      })
      .catch(_error => {
        store.dispatch(types.ERROR_FOLDER)
      })
  })

  store.on(
    types.INVITE_TO_FOLDER,
    async (state, { data, folderId, onFinish, onError }) => {
      store.dispatch(types.SAVING_FOLDER)
      const { error } = await api({
        method: 'PUT',
        endpoint: `folders/${folderId}`,
        body: data,
      })
      if (error) {
        store.dispatch(types.ERROR_SAVING_FOLDER)
        onError(error)
      } else {
        track('Folder Invite Sent')
        onFinish(data)
        store.dispatch(types.SAVED_FOLDER)
        store.dispatch(types.FETCH_FOLDER, { folderId })
      }
    }
  )

  store.on(types.REVOKE_FOLDER_ACCESS, async (state, { folderId, userId, onError }) => {
    store.dispatch(types.SAVING_FOLDER)
    const { error } = await api({
      method: 'PUT',
      endpoint: `folders/${folderId}/members/${userId}`,
    })
    if (error) {
      store.dispatch(types.ERROR_SAVING_FOLDER)
      onError(error)
    } else {
      store.dispatch(types.SAVED_FOLDER)
      track('Folder Access Revoked')
      if (
        state &&
        state.folders &&
        state.folders.currentFolder &&
        state.folders.currentFolder.team_id
      ) {
        store.dispatch(types.FETCH_TEAM, state.folders.currentFolder.team_id)
      } else {
        store.dispatch(types.FETCH_FOLDER, { folderId })
      }
    }
  })
}
