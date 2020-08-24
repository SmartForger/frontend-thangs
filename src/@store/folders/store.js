import api from '@services/api'
import * as types from '@constants/storeEventTypes'

const getInitAtom = () => ({
  isLoading: false,
  isLoaded: false,
  loadError: false,
  isSaving: false,
  isSaved: false,
  saveError: false,
  currentFolder: null,
  createdFolder: null,
  data: {},
})

export default store => {
  store.on(types.STORE_INIT, () => ({
    folders: getInitAtom(),
  }))

  store.on('update-folders', (state, event) => ({
    folders: {
      ...state.folders,
      data: event,
    },
  }))

  store.on('update-folder', (state, event) => ({
    folders: {
      ...state.folders,
      isLoaded: true,
      isLoading: false,
      currentFolder: event,
    },
  }))

  store.on('folders-loading', (state, _event) => ({
    folders: {
      ...state.folders,
      isLoading: true,
      isLoaded: false,
    },
  }))

  store.on('folders-loaded', (state, _event) => ({
    folders: {
      ...state.folders,
      isLoading: false,
      isLoaded: true,
    },
  }))

  store.on('folders-action-error', (state, _event) => ({
    folders: {
      ...state.folders,
      loadError: true,
    },
  }))

  store.on('fetch-folders', async _state => {
    store.dispatch('folders-loading')
    await api({
      method: 'GET',
      endpoint: 'folders',
    })
      .then(res => {
        store.dispatch('folders-loaded')
        store.dispatch('update-folders', res.data)
      })
      .catch(_error => {
        store.dispatch('folders-action-error')
      })
  })

  store.on('fetch-folder', async (state, { folderId, inviteCode }) => {
    store.dispatch('folders-loading')
    await api({
      method: 'GET',
      endpoint: `folders/${folderId}${inviteCode ? `?inviteCode=${inviteCode}` : ''}`,
    })
      .then(res => {
        const folder = res.data
        store.dispatch('folders-loaded')
        store.dispatch('update-folder', folder)
      })
      .catch(_error => {
        store.dispatch('folders-action-error')
      })
  })

  store.on('folder-saving', state => ({
    folders: {
      ...state.folders,
      isSaving: true,
      isSaved: false,
    },
  }))

  store.on('folder-saved', state => ({
    folders: {
      ...state.folders,
      isSaving: false,
      isSaved: true,
    },
  }))

  store.on('folder-save-error', state => ({
    folders: {
      ...state.folders,
      saveError: true,
      isSaving: false,
      isSaved: false,
    },
  }))

  store.on('saved-folder-data', (state, folder) => ({
    folders: {
      ...state.folders,
      createdFolder: folder,
    },
  }))

  store.on('create-folder', (state, { data, onFinish, onError }) => {
    store.dispatch('folder-saving')
    api({
      method: 'POST',
      endpoint: 'folders',
      body: data,
    })
      .then(res => {
        if (res.status === 201) {
          store.dispatch('saved-folder-data', res.data)
          onFinish(res.data)
          store.dispatch('folder-saved')
          store.dispatch('fetch-folders')
        }
      })
      .catch(error => {
        store.dispatch('folder-saved-error')
        onError(error)
      })
  })

  store.on('delete-folder', async (_state, { folderId, onFinish }) => {
    store.dispatch('folders-loading')
    await api({
      method: 'DELETE',
      endpoint: `folders/${folderId}`,
    })
      .then(_res => {
        store.dispatch('folders-loaded')
        onFinish()
      })
      .catch(_error => {
        store.dispatch('folders-action-error')
      })
  })

  store.on('invite-to-folder', async (state, { data, folderId, onFinish, onError }) => {
    store.dispatch('folder-saving')
    const { error } = await api({
      method: 'PUT',
      endpoint: `folders/${folderId}`,
      body: data,
    })
    if (error) {
      store.dispatch('folder-saved-error')
      onError(error)
    } else {
      onFinish(data)
      store.dispatch('folder-saved')
      store.dispatch('fetch-folder', { folderId })
    }
  })

  store.on('revoke-folder-access', async (state, { folderId, userId, onError }) => {
    store.dispatch('folder-saving')
    const { error } = await api({
      method: 'PUT',
      endpoint: `folders/${folderId}/members/${userId}`,
    })
    if (error) {
      store.dispatch('folder-saved-error')
      onError(error)
    } else {
      store.dispatch('folder-saved')
      if (
        state &&
        state.folders &&
        state.folders.currentFolder &&
        state.folders.currentFolder.team_id
      ) {
        store.dispatch('fetch-team', state.folders.currentFolder.team_id)
      } else {
        store.dispatch('fetch-folder', { folderId })
      }
    }
  })
}
