import api from '@services/api'

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
  store.on('@init', () => ({
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

  store.on('fetch-folder', async (state, folderId) => {
    store.dispatch('folders-loading')
    await api({
      method: 'GET',
      endpoint: `folders/${folderId}`,
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

  store.on('invite-to-folder', (state, { data, folderId, onFinish }) => {
    store.dispatch('folder-saving')
    api({
      method: 'PUT',
      endpoint: `folders/${folderId}`,
      body: data,
    })
      .then(res => {
        if (res.status === 200 || res.status === 204) {
          onFinish(data)
          store.dispatch('folder-saved')
          store.dispatch('fetch-folder', folderId)
        }
      })
      .catch(_error => {
        store.dispatch('folder-saved-error')
      })
  })

  store.on('revoke-folder-access', (state, { folderId, userId }) => {
    store.dispatch('folder-saving')
    api({
      method: 'PUT',
      endpoint: `folders/${folderId}/members/${userId}`,
    })
      .then(res => {
        if (res.status === 200 || res.status === 204) {
          store.dispatch('folder-saved')
          store.dispatch('fetch-folder', folderId)
        }
      })
      .catch(_error => {
        store.dispatch('folder-saved-error')
      })
  })
}
